import { Injectable } from '@nestjs/common';
import { ProductCompetitor } from '../../database/entities/product-competitor.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { PricingLogService } from '../pricing-log/pricing-log.service';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import {
  status_enum,
  PricingLog,
} from 'src/database/entities/pricing-log.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/database/entities/product.entity';
import { DentalkartIndex } from 'src/database/entities/dentalkart-index.entity';
import pLimit from 'p-limit';
import { ConfigurationService } from '../configuration/configuration.service';
import { CompetitorIndex } from 'src/database/entities/competitor-index';

type indexType = {
  index: number;
  competitorDomain: string;
};
@Injectable()
export class SchedulerService {
  constructor(
    private ScrapingService: ScrapingService,
    private PricingLogService: PricingLogService,
    private ProductCompetitorService: ProductCompetitorService,
    private ProductsService: ProductsService,
    private ConfigurationService: ConfigurationService,
  ) {}
  // @Cron(CronExpression.EVERY_12_HOURS)
  async hourlyTask() {
    const limit = pLimit(5);

    console.log('scheduler started...');

    let page = 0;

    let productList = await this.ProductsService.completeListForScraping(page);
    let promises = productList.data.map((product) =>
      limit(() => this.scrapeProduct(product)),
    );
    while (page < productList.totalPages) {
      await Promise.all(promises);

      productList = await this.ProductsService.completeListForScraping(
        page + 1,
      );
      promises = productList.data.map((product) =>
        limit(() => this.scrapeProduct(product)),
      );
      page++;
    }

    //reusing the page variable initialized above
    page = 0;
    let competitorList =
      await this.ProductCompetitorService.completeListForScraping(page);

    if (competitorList.totalCount == 0) {
      return;
    }

    const indexObjectMapper = (acc, indexVal) => {
      if (indexVal.index == 0) {
        return acc;
      }

      if (!acc[indexVal.competitorDomain]) {
        acc[indexVal.competitorDomain] = {
          sum: 0,
          count: 0,
        };
      }

      return {
        sum: acc.sum + Math.pow(indexVal.index, -1),
        count: acc.count + 1,
        competitors: {
          ...acc.competitors,
          [indexVal.competitorDomain]: {
            ...acc.competitors[indexVal.competitorDomain],
            sum:
              acc.competitors[indexVal.competitorDomain]?.sum ||
              0 + indexVal.index,
            count: acc.competitors[indexVal.competitorDomain]?.count || 0 + 1,
          },
        },
      };
    };

    let competitorIndicesData = {
      sum: 0,
      count: 0,
      competitors: {},
    };
    while (page < competitorList.totalPages) {
      let indexes = await Promise.all(
        competitorList.data.reduce((acc: Promise<indexType>[], competitor) => {
          if (competitor.configuration && competitor.configuration.is_active)
            acc.push(limit(() => this.scrapeCompetitor(competitor)));

          return acc;
        }, []),
      );

      competitorIndicesData = indexes.reduce(
        indexObjectMapper,
        competitorIndicesData,
      );

      competitorList =
        await this.ProductCompetitorService.completeListForScraping(page + 1);

      page++;
    }

    //scraping will be done only for those competitors whose configuration is active i.e not blocked

    const { sum, count, competitors } = competitorIndicesData;

    const dentalkartIndex = (sum / count) * 100;

    //when we have found dentalkart index after a particular scheduler instance
    await DentalkartIndex.create({
      index: dentalkartIndex,
    });

    const competitorDomains = Object.keys(competitors);

    for (let i = 0; i < competitorDomains.length; i++) {
      const domain = competitorDomains[i];
      const indexVal = competitors[domain];

      const configuration = await this.ConfigurationService.getByDomain(domain);

      if (configuration) {
        await CompetitorIndex.create({
          index: (indexVal.sum / indexVal.count) * 100,
          configuration_id: configuration.id,
        });
      }
    }

    console.log('scheduler completed');
  }

  private scrapeCompetitor(competitor: ProductCompetitor) {
    console.log('scraper regested for competitor id : ', competitor.id);
    // this promise returns the index value for every competitor product;
    // competitorProductIndex = dentalkart_price/competitor_price
    // dentalkartProductIndex = (competitorProductIndex)^-1;
    // dentalkartIndex = ΣdentalkartProductIndex(i)/n
    return new Promise<indexType>(async (resolve, reject) => {
      let index = 0;
      try {
        const configuration = competitor.configuration;

        const htmlRawData = await this.ScrapingService.scrapeData(
          competitor.competitor_url,
          configuration.jsRendering,
        );

        if (!htmlRawData) {
          throw new Error('Html not present');
        }

        const stockStatus = await this.ScrapingService.getStockInfo(
          htmlRawData,
          competitor.dom_query.stock_query,
          competitor.dom_query.stock_pattern,
        );

        const currentPrice = await this.ScrapingService.getPrice(
          htmlRawData,
          competitor.dom_query.price_query,
        );
        if (!currentPrice) {
          throw new Error();
        }
        const previousPrice = competitor.price;

        await this.PricingLogService.addCompetitorEntry({
          price_before: previousPrice,
          price_after: currentPrice,
          product_id: competitor.product_id,
          product_competitor_id: competitor.id,
          dom_query: competitor.dom_query.price_query,
          status: status_enum.SUCCESS,
          index: competitor.product.base_price / currentPrice,
        });
        index = competitor.product.base_price / currentPrice;

        let hasPriceUpdated = false;
        let hasStockUpdated = false;

        if (previousPrice != currentPrice) {
          hasPriceUpdated = true;
          competitor.set({ price: currentPrice });
        }
        if (stockStatus != competitor.in_stock) {
          hasStockUpdated = true;
          competitor.set({ in_stock: stockStatus });
        }

        if (hasPriceUpdated || hasStockUpdated) {
          await competitor.save();
        }
      } catch (error) {
        await this.PricingLogService.addCompetitorEntry({
          price_before: competitor.price,
          price_after: competitor.price,
          product_id: competitor.product_id,
          product_competitor_id: competitor.id,
          dom_query: competitor.dom_query.price_query,
          status: status_enum.FAILURE,
        });
        // reject();
      }
      resolve({
        index: index,
        competitorDomain: competitor.domain,
      });
    });
  }

  private scrapeProduct(product: Product) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const productInfo = await this.ProductsService.fetchProductInfo(
          product.product_url,
        );
        if (!productInfo) {
          throw new Error();
        }
        await this.PricingLogService.addProductEntry({
          price_before: product.base_price,
          price_after: productInfo.price,
          product_id: product.id,
          status: status_enum.SUCCESS,
        });

        if (product.base_price != productInfo.price) {
          await this.ProductsService.update(product.id, {
            base_price: productInfo.price,
            product_url: product.product_url,
          });
        }

        await this.ProductsService.updateInStock(
          product,
          productInfo.is_in_stock,
        );
      } catch (error) {
        await this.PricingLogService.addProductEntry({
          price_before: product.base_price,
          price_after: product.base_price,
          product_id: product.id,
          status: status_enum.FAILURE,
        });
      }
      resolve();
    });
  }
}
