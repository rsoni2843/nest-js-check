import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ProductCreateArgs, ProductUpdateArgs } from './dto/product.body';
import {
  Product,
  marketPositionType,
} from 'src/database/entities/product.entity';
import { ProductCategoryService } from '../product-category/produuct-category.service';
import { Category } from '../../database/entities/category.entity';
import { CategoryService } from '../category/category.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import env from 'src/config/env';
import { ProductCompetitor } from 'src/database/entities/product-competitor.entity';
import { Op, Sequelize } from 'sequelize';
import { sorting_order, sorting_order_type } from 'src/pipes/query-params.pipe';
import { sorting_keys } from './dto/sorting_order';
import { Literal } from 'sequelize/types/utils';
import { BrandService } from '../brand/brand.service';
import { Brand } from 'src/database/entities/brand.entity';
import { StatsService } from '../stats/stats.service';
import {
  PricingLog,
  status_enum,
} from 'src/database/entities/pricing-log.entity';
import { ProductPricingLog } from 'src/database/entities/product-pricing-log.entity';
import { Response } from 'express';
import { Configuration } from 'src/database/entities/configuration.entity';
import * as fs from 'fs';
import { S3Service } from '../../utils/s3-service';
import { ReportFiles } from 'src/database/entities/report-files.entity';
import { ConfigurationService } from '../configuration/configuration.service';
import { formatDateString } from 'src/utils/date-helper';
import { DOM_Query } from 'src/database/entities/dom_query.entity';

export enum price_variation_enum {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}
@Injectable()
export class ProductsService {
  constructor(
    private ProductCategoryService: ProductCategoryService,
    private CategoryService: CategoryService,
    private httpService: HttpService,
    private BrandService: BrandService,
    private StatsService: StatsService,
    private ConfigurationService: ConfigurationService,
    private S3Service: S3Service,
  ) {}
  async create(data: ProductCreateArgs) {
    const productInfo = await this.fetchProductInfo(data.product_url);

    if (!productInfo) {
      throw new BadRequestException(
        'unable to load product details from the product url',
      );
    }
    const { category_id, ...createBody } = data;

    const productWithExactProductCode = await Product.findOne({
      where: { product_code: productInfo.product_code },
    });

    if (productWithExactProductCode) {
      throw new ConflictException(
        'product with the same product code already exist',
      );
    }

    const brand = await this.BrandService.get(data.brand_id);

    const createdProduct = await Product.create({
      ...createBody,
      base_price: productInfo.price,
      in_stock: productInfo.is_in_stock,
      name: data.name ? data.name : productInfo.name,
      product_code: data.product_code,
      brand_id: brand.id,
    });

    if (category_id) await this.addCategory(createdProduct.id, category_id);

    return createdProduct;
  }

  async update(id: number, data: ProductUpdateArgs) {
    const product = await this.get(id);

    if (data.base_price != product.base_price) {
      await this.updateMarketPosition(product);
    }

    product.set({ ...data });

    if (data.category_id) {
      const existingCategory = await this.CategoryService.get(data.category_id);
      //new category which is to be updated
      await this.ProductCategoryService.update(product.id, existingCategory.id);
    }

    await product.save();

    return product;
  }

  async get(id: number, includeCompetitors?: boolean) {
    // const includeOptions = includeCompetitors
    //   ? { model: ProductCompetitor }
    //   : {};
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'title', 'description'],
          through: { attributes: [] }, // exclude ProductCategory table
        },
        { model: ProductCompetitor },
      ],
    });
    if (!product) throw new BadRequestException('unable to get product');

    return product;
  }

  async list(
    page: number,
    size: number,
    sorting_order: [Literal, sorting_order],
    searchParams: any,
    category_id?: number,
    brand_id?: number,
    configuration_id?: number,
    includeProductswithFailedScraping?: boolean,
  ) {
    const categoryOptions = category_id ? { where: { id: category_id } } : {};
    const brandOptions = brand_id ? { where: { id: brand_id } } : {};
    const configurationOptions = configuration_id
      ? { where: { configuration_id: configuration_id } }
      : {};

    let failedOptions = {};
    if (includeProductswithFailedScraping) {
      const products = await Product.findAll({
        attributes: ['id'],
        include: [
          {
            model: ProductCompetitor,
            include: [
              {
                model: PricingLog,
                order: [['found_at', 'DESC']],
                limit: 1,
              },
              {
                model: Configuration,
                attributes: ['id', 'domain'],
                where: { is_active: true },
              },
            ],
          },
        ],
      });

      failedOptions = {
        id: {
          [Op.in]: products.reduce((productIds, product) => {
            let id = null;

            for (let comp of product.product_competitors) {
              if (comp.pricing_logs[0]?.status == 'failure') {
                productIds.push(product.id);
                break;
              }
            }
            return productIds;
          }, []),
        },
      };
    }

    const productList = await Product.findAndCountAll({
      where: {
        ...searchParams,
        ...failedOptions,
      },
      attributes: [
        ...Object.keys(Product.getAttributes()),
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM product_competitor WHERE product_competitor.product_id = Product.id) `,
          ),
          'competitor_count',
        ],
      ],
      include: [
        {
          model: ProductCompetitor,
          attributes: [],
          ...configurationOptions,
        },
        {
          model: Category,
          attributes: ['id', 'title', 'description'],
          through: { attributes: [] }, // exclude ProductCategory table
          ...categoryOptions,
        },
        {
          model: Brand,
          attributes: ['id', 'name'],
          ...brandOptions,
        },
      ],

      distinct: true,
      order: [sorting_order],
      limit: size,
      offset: page * size,
    });

    const totalCount = productList.count;

    return {
      data: productList.rows,
      totalCount: totalCount,
      totalPages: Math.ceil(productList.count / Number(size)),
    };
  }

  async insights(
    page: number,
    size: number,
    searchParams: any,
    sorting_order: [Literal, sorting_order],
    categories: number[],
    brands: number[],
    configurations: number[],
    products: number[],
    includeProductswithFailedScraping: boolean,
    getCompleteList: boolean,
  ) {
    const categoryOptions = categories
      ? {
          where: {
            id: {
              [Op.in]: categories,
            },
          },
        }
      : {};

    const brandOptions = brands
      ? {
          where: {
            id: {
              [Op.in]: brands,
            },
          },
        }
      : {};

    const configurationOptions = configurations
      ? {
          where: {
            configuration_id: {
              [Op.in]: configurations,
            },
          },
        }
      : {};

    let productOptions = products
      ? {
          id: {
            [Op.in]: products,
          },
        }
      : {};

    if (includeProductswithFailedScraping) {
      const products = await Product.findAll({
        attributes: ['id'],
        include: [
          {
            model: ProductCompetitor,
            include: [
              {
                model: PricingLog,
                order: [['found_at', 'DESC']],
                limit: 1,
              },
            ],
          },
        ],
      });

      productOptions = {
        id: {
          [Op.in]: [
            ...products,
            ...products.reduce((productIds, product) => {
              for (let comp of product.product_competitors) {
                if (comp.pricing_logs[0]?.status == 'failure') {
                  productIds.push(product.id);
                  break;
                }
              }
              return productIds;
            }, []),
          ],
        },
      };
    }

    const pricingLogOptions = {};

    const productCompetitorIncludeOptions: any[] = [
      {
        model: PricingLog,
        order: [['found_at', 'DESC']],
        ...pricingLogOptions,
        limit: 1,
      },
      {
        model: Configuration,
        attributes: ['id', 'domain'],
        where: { is_active: true },
      },
      { model: DOM_Query, attributes: ['id', 'query_type'] },
    ];

    //if getCompleteList i.e exporting document so we'll include only those products whose configuration is active
    if (getCompleteList) {
      productCompetitorIncludeOptions.push({
        model: Configuration,
        where: {
          is_active: true,
        },
      });
    }

    const options: any = {
      subQuery: false,
      where: {
        ...searchParams,
        ...productOptions,
      },
      attributes: [...Object.keys(Product.getAttributes())],
      include: [
        {
          model: ProductCompetitor,
          // subQuery: false,
          include: [...productCompetitorIncludeOptions],
          ...configurationOptions,
        },
        {
          model: Category,
          attributes: ['id', 'title', 'description'],
          through: { attributes: [] }, // exclude ProductCategory table
          ...categoryOptions,
        },
        {
          model: Brand,
          attributes: ['id', 'name'],
          ...brandOptions,
        },
      ],
      order: [sorting_order],
    };
    if (!getCompleteList) {
      options.limit = size;
      options.offset = page * size;
    }

    let list = null;
    let paginatedList = null;

    if (getCompleteList) list = await Product.findAll({ ...options });
    else
      paginatedList = await Product.findAndCountAll({
        ...options,
        group: ['id'],
        limit: size,
        offset: page * size,
      });

    if (getCompleteList) return list;

    return {
      data: paginatedList.rows,
      totalCount: paginatedList.count.length,
      totalPages: Math.ceil(paginatedList.count.length / Number(size)),
    };
  }

  async download(
    data: Product[],
    filterOptions: { [key: string]: any },
    res: Response,
  ) {
    const directoryPath = './reports';
    const filename = `report_${Date.now()}.csv`;

    // Check if directory exists, create it if it doesn't
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filepath = `${directoryPath}/${filename}`;

    // Create a write stream to write the CSV file
    const writeStream = fs.createWriteStream(filepath);
    const headers = [
      'Product Name',
      'Product Code',
      'Brand',
      'Category',
      'My Position',
      'My Index',
      'Minimum Price',
      'Maximum Price',
      'Average Price',
      'My Price',
      'Cheapest Site',
      'Highest Site',
      'Our Stock',
    ];

    const configurations = await Configuration.findAll();
    for (let config of configurations) {
      headers.push(`${config.domain}-Stock`);
      headers.push(`${config.domain}-Price`);
      headers.push(`${config.domain}-URL`);
      headers.push(`${config.domain}-Last time scraped`);
      headers.push(`${config.domain}-scraping status`);
    }

    //Populating filtered results
    writeStream.write('Filter Options\n');
    writeStream.write(
      `sorting:${filterOptions.sortingParams['1']},${filterOptions.sortingParams['0'].val}\n`,
    );
    if (filterOptions.brands?.length > 0) {
      writeStream.write(
        `brands,${await this.BrandService.getBrandsFromIdArray(
          filterOptions.brands,
        )}\n`,
      );
    }
    if (filterOptions.categories?.length > 0) {
      writeStream.write(
        `categories,${await this.CategoryService.getCategoriesFromIdArray(
          filterOptions.categories,
        )}\n`,
      );
    }
    if (filterOptions.configurations?.length > 0) {
      writeStream.write(
        `competitors,${await this.ConfigurationService.getConfigurationsFromIdArray(
          filterOptions.configurations,
        )}\n`,
      );
    }
    if (filterOptions.variation_type) {
      writeStream.write(`price variation,${filterOptions.variation_type}\n`);
    }
    if (filterOptions.in_stock) {
      writeStream.write(`In Stock,${filterOptions.in_stock}\n`);
    }
    if (filterOptions.price) {
      writeStream.write(
        `Price,${filterOptions.price_comparison},${filterOptions.price}\n`,
      );
    }
    if (filterOptions.name) {
      writeStream.write(`Product Name,${filterOptions.name}\n`);
    }

    if (filterOptions.code) {
      writeStream.write(`Product Code,${filterOptions.code}\n`);
    }
    if (filterOptions.product_code_or_name) {
      writeStream.write(
        `Product Code or Name,${filterOptions.product_code_or_name}\n`,
      );
    }
    if (filterOptions.include_failed_products) {
      writeStream.write(`404 URL Page , Yes\n`);
    }

    writeStream.write(`\n\n${headers.join(',')}\n`);

    for (let item of data) {
      const itemd = item.product_competitors.reduce(
        (acc, comp) => {
          if (!acc[comp.domain]) {
            acc[comp.domain] = {
              stock: comp.in_stock,
              price: comp.price,
              url: comp.competitor_url,
              scrapingStatus: comp.pricing_logs[0]?.status || '-', //last scraping status
              scrapingTime: comp.pricing_logs[0]
                ? new Date(comp.pricing_logs[0].found_at)
                    .toLocaleString()
                    .split(',')
                    .join(' ')
                : '-',
            };
          }
          acc.index = comp.pricing_logs.reduce((index, log) => {
            return index + Math.pow(log.index, -1);
          }, 0);
          return acc;
        },
        { index: 0 },
      );

      const addittionalColumns = [];

      for (let config of configurations) {
        if (itemd[config.domain]) {
          addittionalColumns.push(
            itemd[config.domain].stock ? 'In Stock' : 'Out of Stock',
          );
          addittionalColumns.push(itemd[config.domain].price);
          addittionalColumns.push(itemd[config.domain].url);
          addittionalColumns.push(itemd[config.domain].scrapingTime);
          addittionalColumns.push(itemd[config.domain].scrapingStatus);
        } else {
          addittionalColumns.push(...['-', '-', '-', '-', '-']);
        }
      }

      const itemIndex = item.product_competitors.length
        ? (itemd.index * 100) / item.product_competitors.length
        : 0;

      const { maxPrice, minPrice, total, minSite, maxSite } =
        item.product_competitors.reduce(
          (acc, comp) => {
            if (acc.maxPrice < comp.price) {
              acc.maxPrice = comp.price;
              acc.maxSite = comp.domain;
            }
            if (acc.minPrice > comp.price) {
              acc.minPrice = comp.price;
              acc.minSite = comp.domain;
            }
            acc.total = acc.total + comp.price;
            return acc;
          },
          {
            maxPrice: item.base_price,
            minSite: 'dentalkart.com',
            maxSite: 'dentalkart.com',
            minPrice: item.base_price,
            total: item.base_price,
          },
        );

      writeStream.write(
        `${item.name},${item.product_code},${item.brand.name},${
          item.categories.length
            ? item.categories.map((c, index) => `${c.title} `)
            : '-'
        },${item.market_position},${itemIndex},${minPrice},${maxPrice},${
          item.product_competitors.length
            ? (total / (item.product_competitors.length + 1)).toFixed(2)
            : '-'
        },${item.base_price},${minSite},${maxSite},${
          item.in_stock ? 'In Stock' : 'Out of Stock'
        },${addittionalColumns.join(',')}\n`,
      );
    }

    writeStream.end();
    writeStream.on('finish', async () => {
      // Once the file is written, open a read stream and stream it back to the client
      const readStream = fs.createReadStream(filepath);
      res.setHeader('Content-Disposition', `attachment; filename=${filepath}`);
      res.setHeader('Content-Type', 'text/csv');

      readStream.on('end', () => {
        //deleting the temp report file
        fs.unlink(filepath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('temporary report file deleted successfully!');
        });
      });
      try {
        const uploadedFilename = `report_${formatDateString(new Date())}.csv`;
        const reportFileURL = await this.S3Service.uploadFileToS3(
          `reports/${uploadedFilename}`,
          readStream,
        );
        // console.log(filterOptions);
        const report = await ReportFiles.create({
          report_file: reportFileURL,
          filter_options: filterOptions,
          filename: uploadedFilename,
        });
        console.log('Report URL', reportFileURL);
        res.json({ fileurl: reportFileURL });
      } catch (e) {
        console.log('Error', e);
      }

      // readStream.pipe(res);
    });
  }

  async getProductIdsFromPriceVariation(
    start: Date,
    end: Date,
    variation_type: price_variation_enum,
  ) {
    const list = await this.StatsService.getPriceVariation(start, end, true);

    const productIds = (list as any[]).reduce((acc, item) => {
      if (
        variation_type === price_variation_enum.INCREASE &&
        item.dataValues.price_increase != '0'
      ) {
        acc.push(item.product_id);
      }
      if (
        variation_type === price_variation_enum.DECREASE &&
        item.dataValues.price_decrease != '0'
      ) {
        acc.push(item.product_id);
      }
      return acc;
    }, []);
    return productIds;
  }

  async completeListForScraping(page: number) {
    const size = 10;
    const list = await Product.findAndCountAll({
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
    const product = await this.get(id);

    //deleting associated competitor products
    for (let competitor of product.product_competitors) {
      await competitor.destroy();
    }

    await product.destroy();
  }

  async updateMarketPosition(product: Product) {
    const competitors = await ProductCompetitor.findAll({
      where: { product_id: product.id },
      include: [{ model: Configuration, where: { is_active: true } }],
    });

    const { sum, max, min } = competitors.reduce(
      (acc, competitor) => {
        return {
          sum: acc.sum + competitor.price,
          min: Math.min(acc.min, competitor.price),
          max: Math.max(acc.max, competitor.price),
        };
      },
      {
        sum: 0,
        min: Infinity,
        max: -Infinity,
      },
    );

    const avg = sum / competitors.length;
    let marketPosition: marketPositionType = null;
    if (product.base_price == avg) {
      marketPosition = marketPositionType.AVERAGE;
    } else if (product.base_price < avg && product.base_price > min)
      marketPosition = marketPositionType.CHEAPER;
    else if (product.base_price <= min)
      marketPosition = marketPositionType.CHEAPEST;
    else if (product.base_price < max && product.base_price > avg)
      marketPosition = marketPositionType.COSTLIER;
    else if (product.base_price >= max)
      marketPosition = marketPositionType.COSTLIEST;

    product.set({ market_position: marketPosition });
    await product.save();
  }

  async addCategory(product_id: number, category_id: number) {
    await this.ProductCategoryService.create(product_id, category_id);
  }

  async removeCategory(product_id: number, category_id: number) {
    await this.ProductCategoryService.remove(product_id, category_id);
  }

  async updateInStock(product: Product, inStock: boolean): Promise<void> {
    product.set({ in_stock: inStock });
    await product.save();
  }

  getSortingParams(
    priceOrder: sorting_order_type,
    productCodeOrder: sorting_order_type,
    nameOrder: sorting_order_type,
    competitorCountOrder: sorting_order_type,
    createdAtOrder: sorting_order_type,
    marketPosition: marketPositionType | undefined,
  ): [Literal, sorting_order] {
    if (marketPosition) {
      if (
        marketPosition === marketPositionType.CHEAPER ||
        marketPosition === marketPositionType.CHEAPEST
      )
        return [Sequelize.literal('base_price'), sorting_order.ASC];

      if (
        marketPosition === marketPositionType.COSTLIER ||
        marketPosition === marketPositionType.COSTLIEST
      )
        return [Sequelize.literal('base_price'), sorting_order.DESC];
    }
    if (priceOrder) return [Sequelize.literal('base_price'), priceOrder];
    if (productCodeOrder)
      return [Sequelize.literal('product_code'), productCodeOrder];
    if (nameOrder) return [Sequelize.literal('name'), nameOrder];
    if (competitorCountOrder)
      return [Sequelize.literal('competitor_count'), competitorCountOrder];
    if (createdAtOrder)
      return [Sequelize.literal('created_at'), createdAtOrder];

    return [Sequelize.literal('created_at'), sorting_order.DESC];
  }

  getSearchParams(
    product_code_or_name: string | undefined,
    product_code: string | undefined,
    product_name: string | undefined,
    price: string | undefined,
    price_comparison: string | undefined,
    market_position: string | undefined,
    in_stock: boolean | undefined,
  ): any {
    const queryObj: any = {};

    if (product_code)
      queryObj.product_code = { [Op.like]: `%${product_code}%` };

    if (product_name) queryObj.name = { [Op.like]: `%${product_name}%` };

    if (price && price_comparison)
      queryObj.base_price = { [Op[price_comparison]]: price };

    if (market_position) queryObj.market_position = market_position;

    if (in_stock !== undefined) queryObj.in_stock = in_stock;

    if (product_code_or_name) {
      queryObj[Op.or] = {
        product_code: { [Op.like]: `%${product_code_or_name}%` },
        name: { [Op.like]: `%${product_code_or_name}%` },
      };
    }

    return queryObj;
  }

  async fetchProductInfo(product_url: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(env.dentalkart_product_api_url, {
          data: {
            url_key: product_url,
          },
          headers: {
            'x-api-key': env.dentalkart_product_api_key,
          },
        }),
      );
      return [200, 201].indexOf(response.status) === -1 ? null : response?.data;
    } catch (err) {
      console.log(err);
    }
  }
}
