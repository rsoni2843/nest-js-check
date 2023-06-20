import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getDomain } from 'src/utils/domain-helper';
import {
  ProductCompetitorCreateArgs,
  ProductCompetitorUpdateArgs,
} from './dto/product-competitor.body';
import { ConfigurationService } from '../configuration/configuration.service';
import { ProductCompetitor } from '../../database/entities/product-competitor.entity';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/database/entities/product.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { Configuration } from '../../database/entities/configuration.entity';
import { PricingLog } from 'src/database/entities/pricing-log.entity';
import { Literal } from 'sequelize/types/utils';
import { sorting_order, sorting_order_type } from 'src/pipes/query-params.pipe';
import { Op, Sequelize } from 'sequelize';
import { DOM_Query, query_type } from 'src/database/entities/dom_query.entity';

@Injectable()
export class ProductCompetitorService {
  constructor(
    private ConfigurationService: ConfigurationService,
    private ProductsService: ProductsService,
    private ScrapingService: ScrapingService,
  ) {}
  async create(data: ProductCompetitorCreateArgs) {
    const domain = getDomain(data.competitor_url);
    const product = await this.ProductsService.get(data.product_id);
    const configuration = await this.ConfigurationService.getByDomain(domain);

    if (!configuration)
      throw new BadRequestException('no configuration exists for this domain');

    // competitorExisting means a competitor already exist with the same configuration
    const competitorExisting = product.product_competitors.reduce(
      (acc, item) => {
        if (item.configuration_id === configuration.id) return true;
        return acc;
      },
      false,
    );

    if (competitorExisting) {
      throw new BadRequestException(
        `a competitor for the domain :${configuration.domain} is already existing!`,
      );
    }

    const htmlRawData = await this.ScrapingService.scrapeData(
      data.competitor_url,
      configuration.jsRendering,
    );

    const newQuery = data.is_grouped
      ? await DOM_Query.create({
          price_query: data.price_query,
          stock_query: data.stock_query,
          stock_pattern: data.stock_pattern,
          configuration_id: configuration.id,
        })
      : null;

    const price = await this.ScrapingService.getPrice(
      htmlRawData,
      data.is_grouped ? newQuery.price_query : configuration.price_dom_query,
    );

    if (!price)
      throw new InternalServerErrorException(
        'unable to get price of this product',
      );

    const stockStatus = await this.ScrapingService.getStockInfo(
      htmlRawData,
      data.is_grouped ? newQuery.stock_query : configuration.stock_dom_query,
      data.is_grouped ? newQuery.stock_pattern : configuration.stock_pattern,
    );

    const defaultQuery = data.is_grouped
      ? null
      : await DOM_Query.findOne({
          where: {
            configuration_id: configuration.id,
            query_type: query_type.DEFAULT,
          },
        });

    const competitor = await ProductCompetitor.create({
      name: data.name,
      domain,
      competitor_url: data.competitor_url,
      product_id: product.id,
      configuration_id: configuration.id,
      price,
      in_stock: stockStatus,
      dom_query_id: data.is_grouped ? newQuery.id : defaultQuery.id,
    });

    await this.ProductsService.updateMarketPosition(product);

    return competitor;
  }

  async updateInStockStatus(
    competitorId: number,
    inStock: boolean,
  ): Promise<void> {
    try {
      const competitor = await ProductCompetitor.findOne({
        where: { id: competitorId },
      });
      if (!competitor) {
        throw new Error('Competitor not found');
      }
      competitor.in_stock = inStock;
      await competitor.save();
    } catch (error) {
      throw new Error('Failed to update in_stock status');
    }
  }

  async get(id: number) {
    const competitor = await ProductCompetitor.findByPk(id, {
      include: [{ model: Configuration }, { model: DOM_Query }],
    });

    if (!competitor) throw new BadRequestException('unable to find competitor');

    return competitor;
  }

  async list(
    page: number,
    size: number,
    sorting_order: [Literal, sorting_order],
    productId?: number,
    configurationId?: number,
  ) {
    const product = productId
      ? await this.ProductsService.get(productId)
      : null;
    const config = configurationId
      ? await this.ConfigurationService.get(configurationId)
      : null;

    let queryOptions = {
      where: {},
    };

    if (product)
      queryOptions.where = { ...queryOptions.where, product_id: product.id };
    if (config)
      queryOptions.where = {
        ...queryOptions.where,
        configuration_id: config.id,
      };

    const competitorList = await ProductCompetitor.findAndCountAll({
      ...queryOptions,
      attributes: [
        'id',
        'domain',
        'name',
        'price',
        'competitor_url',
        'in_stock',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: PricingLog,
          order: [['found_at', 'DESC']],
          limit: 1,
        },
        {
          model: Product,
          attributes: ['id', 'name', 'base_price', 'product_url'],
        },
        { model: DOM_Query, attributes: ['id', 'query_type'] },

        // {
        //   model: Configuration,
        //   attributes: ['id', 'domain'],
        //   where: { is_active: true },
        // },
      ],
      limit: size,
      offset: page * size,
      order: [sorting_order],
    });

    return {
      data: competitorList.rows,
      totalPages: Math.ceil(competitorList.count / Number(size)),
    };
  }

  // async productWiseList(productId: number) {
  //   return await ProductCompetitor.findAll({
  //     where: {
  //       product_id: productId,
  //     },
  //   });
  // }
  async update(id: number, data: ProductCompetitorUpdateArgs) {
    const competitor = await this.get(id);

    if (data.name) competitor.set({ name: data.name });

    if (data.competitor_url) {
      const domain = getDomain(data.competitor_url);
      const configuration = await this.ConfigurationService.getByDomain(domain);

      const htmlRawData = await this.ScrapingService.scrapeData(
        data.competitor_url,
        configuration.jsRendering,
      );

      const price = await this.ScrapingService.getPrice(
        htmlRawData,
        competitor.dom_query.price_query,
      );

      const stockInfo = await this.ScrapingService.getStockInfo(
        htmlRawData,
        competitor.dom_query.stock_query,
        competitor.dom_query.stock_pattern,
      );

      if (!price)
        throw new InternalServerErrorException(
          'unable to get price from this url',
        );

      competitor.set({
        price,
        configuration_id: configuration.id,
        domain,
        competitor_url: data.competitor_url,
        in_stock: stockInfo,
      });
    }

    if (data.product_id) {
      const product = await this.ProductsService.get(data.product_id);
      competitor.set({ product_id: product.id });
    }

    await competitor.save();

    return competitor;
  }

  async completeListForScraping(page: number) {
    const size = 10;
    const list = await ProductCompetitor.findAndCountAll({
      include: [
        { model: Configuration, where: { is_active: true } },
        { model: DOM_Query },
        {
          model: Product,
          attributes: ['base_price'],
          where: {
            // [Op.not]: { deleted_at: null },
          },
        },
      ],

      limit: size,
      offset: page * size,
    });

    return {
      data: list.rows,
      totalCount: list.count,
      totalPages: Math.ceil(list.count / Number(size)),
    };
  }

  async remove(id: number) {
    const competitor = await this.get(id);

    //if it is a grouped product and has a different dom query from that of configuration's default query
    const defaultConfigurationQuery = await DOM_Query.findOne({
      where: {
        configuration_id: competitor.configuration_id,
        query_type: query_type.DEFAULT,
      },
    });
    if (defaultConfigurationQuery.id !== competitor.dom_query_id) {
      const query = await DOM_Query.findByPk(competitor.dom_query_id);
      await query.destroy();
    }
    const product = await this.ProductsService.get(competitor.product_id);

    await competitor.destroy({
      force: true,
    });

    await this.ProductsService.updateMarketPosition(product);
  }

  getSortingParams(
    priceOrder: sorting_order_type,
    createdAtOrder: sorting_order_type,
    updatedAtOrder: sorting_order_type,
  ): [Literal, sorting_order] {
    if (priceOrder) return [Sequelize.literal('price'), priceOrder];
    if (createdAtOrder)
      return [Sequelize.literal('created_at'), createdAtOrder];
    if (updatedAtOrder)
      return [Sequelize.literal('updated_at'), updatedAtOrder];
    return [Sequelize.literal('created_at'), sorting_order.DESC];
  }
}
