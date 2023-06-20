import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ParseQueryPipe,
  ParseSortingPipe,
  ParseEnumPipe,
  sorting_order_type,
  ParseArrayPipe,
  DateFormatConversionPipe,
} from 'src/pipes/query-params.pipe';
import { ProductCreateArgs, ProductUpdateArgs } from './dto/product.body';
import { ProductsService, price_variation_enum } from './products.service';
import { marketPositionType } from 'src/database/entities/product.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProductCompetitor } from 'src/database/entities/product-competitor.entity';
import { Configuration } from 'src/database/entities/configuration.entity';

@Controller('product')
//@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private ProductsService: ProductsService) {}

  @Post()
  async create(@Body('data') data: ProductCreateArgs) {
    return await this.ProductsService.create(data);
  }

  @Get('list')
  async list(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
    @Query('category_id') category_id: number,
    @Query('brand_id') brand_id: number,
    @Query('configuration_id') configuration_id: number,
    @Query('price', new ParseSortingPipe()) price: sorting_order_type,
    @Query('product_code', new ParseSortingPipe())
    product_code: sorting_order_type,
    @Query('name', new ParseSortingPipe()) name: sorting_order_type,
    @Query('competitor_count', new ParseSortingPipe())
    competitor_count: sorting_order_type,
    @Query('created_at', new ParseSortingPipe())
    created_at: sorting_order_type,
    @Query(
      'q_market_position',
      new ParseEnumPipe(Object.values(marketPositionType)),
    )
    q_market_position: marketPositionType | undefined,
    @Query('q_product_code_or_name') q_product_code_or_name: string,
    @Query('q_product_code') q_product_code: string,
    @Query('q_product_name') q_product_name: string,
    @Query('q_price') q_price: string,
    @Query(
      'q_price_comparison',
      new ParseEnumPipe(['gt', 'gte', 'lt', 'lte', 'eq']),
    )
    q_price_comparison: string,
    @Query('q_in_stock', new ParseEnumPipe(['true', 'false']))
    q_in_stock: string,
    @Query('failed_products') failed_products: boolean,
  ) {
    const sortingParams = this.ProductsService.getSortingParams(
      price,
      product_code,
      name,
      competitor_count,
      created_at,
      q_market_position,
    );
    const searchParams = this.ProductsService.getSearchParams(
      q_product_code_or_name,
      q_product_code,
      q_product_name,
      q_price,
      q_price_comparison,
      q_market_position,
      q_in_stock ? q_in_stock == 'true' : undefined,
    );

    return await this.ProductsService.list(
      page,
      size,
      sortingParams,
      searchParams,
      category_id,
      brand_id,
      configuration_id,
      failed_products ? true : false,
    );
  }

  @Get('insight-list')
  async insightList(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
    // price variation
    @Query(
      'variation_type',
      new ParseEnumPipe(Object.values(price_variation_enum)),
    )
    variation_type: price_variation_enum | undefined,
    @Query('startDate', new DateFormatConversionPipe('startDate')) start: Date,
    @Query('endDate', new DateFormatConversionPipe('endDate')) end: Date,

    @Query('categories', ParseArrayPipe) categories: number[],
    @Query('brands', ParseArrayPipe) brands: number[],
    @Query('configurations', ParseArrayPipe) configurations: number[],
    @Query('price', new ParseSortingPipe()) price: sorting_order_type,
    @Query('product_code', new ParseSortingPipe())
    product_code: sorting_order_type,
    @Query('name', new ParseSortingPipe()) name: sorting_order_type,
    @Query('competitor_count', new ParseSortingPipe())
    competitor_count: sorting_order_type,
    @Query('created_at', new ParseSortingPipe())
    created_at: sorting_order_type,
    @Query(
      'q_market_position',
      new ParseEnumPipe(Object.values(marketPositionType)),
    )
    q_market_position: marketPositionType | undefined,
    @Query('q_product_code_or_name') q_product_code_or_name: string,
    @Query('q_product_code') q_product_code: string,
    @Query('q_product_name') q_product_name: string,
    @Query('q_price') q_price: string,
    @Query(
      'q_price_comparison',
      new ParseEnumPipe(['gt', 'gte', 'lt', 'lte', 'eq']),
    )
    q_price_comparison: string,
    @Query('q_in_stock', new ParseEnumPipe(['true', 'false']))
    q_in_stock: string,
    @Query('q_competitor_in_stock', new ParseEnumPipe(['true', 'false']))
    q_competitor_in_stock: string,
    @Query('failed_products') failed_products: boolean,
  ) {
    const sortingParams = this.ProductsService.getSortingParams(
      price,
      product_code,
      name,
      competitor_count,
      created_at,
      q_market_position,
    );
    const searchParams = this.ProductsService.getSearchParams(
      q_product_code_or_name,
      q_product_code,
      q_product_name,
      q_price,
      q_price_comparison,
      q_market_position,
      q_in_stock ? q_in_stock == 'true' : undefined,
    );

    let productIds = variation_type
      ? await this.ProductsService.getProductIdsFromPriceVariation(
          start,
          end,
          variation_type,
        )
      : undefined;

    if (q_competitor_in_stock !== undefined) {
      const outOfStockCompetitors = await ProductCompetitor.findAll({
        attributes: ['product_id'],
        where: {
          in_stock: q_competitor_in_stock == 'true' ? true : false,
        },
        include: [
          {
            model: Configuration,
            attributes: ['id'],
            where: { is_active: true },
          },
        ],
      });
      if (!productIds) productIds = [];
      productIds = [
        ...productIds,
        ...outOfStockCompetitors.map((c) => c.product_id),
      ];
    }
    return await this.ProductsService.insights(
      page,
      size,
      searchParams,
      sortingParams,
      categories,
      brands,
      configurations,
      productIds,
      failed_products,
      false,
    );
  }

  @Get('download-report')
  async download(
    @Res() res: Response,
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
    // price variation
    @Query(
      'variation_type',
      new ParseEnumPipe(Object.values(price_variation_enum)),
    )
    variation_type: price_variation_enum | undefined,
    @Query('startDate', new DateFormatConversionPipe('startDate')) start: Date,
    @Query('endDate', new DateFormatConversionPipe('endDate')) end: Date,

    @Query('categories', ParseArrayPipe) categories: number[],
    @Query('brands', ParseArrayPipe) brands: number[],
    @Query('configurations', ParseArrayPipe) configurations: number[],
    @Query('price', new ParseSortingPipe()) price: sorting_order_type,
    @Query('product_code', new ParseSortingPipe())
    product_code: sorting_order_type,
    @Query('name', new ParseSortingPipe()) name: sorting_order_type,
    @Query('competitor_count', new ParseSortingPipe())
    competitor_count: sorting_order_type,
    @Query('created_at', new ParseSortingPipe())
    created_at: sorting_order_type,
    @Query(
      'q_market_position',
      new ParseEnumPipe(Object.values(marketPositionType)),
    )
    q_market_position: marketPositionType | undefined,
    @Query('q_product_code_or_name') q_product_code_or_name: string,
    @Query('q_product_code') q_product_code: string,
    @Query('q_product_name') q_product_name: string,
    @Query('q_price') q_price: string,
    @Query(
      'q_price_comparison',
      new ParseEnumPipe(['gt', 'gte', 'lt', 'lte', 'eq']),
    )
    q_price_comparison: string,
    @Query('q_in_stock', new ParseEnumPipe(['true', 'false']))
    q_in_stock: string,
    @Query('failed_products') failed_products: boolean,
  ) {
    const sortingParams = this.ProductsService.getSortingParams(
      price,
      product_code,
      name,
      competitor_count,
      created_at,
      q_market_position,
    );
    const searchParams = this.ProductsService.getSearchParams(
      q_product_code_or_name,
      q_product_code,
      q_product_name,
      q_price,
      q_price_comparison,
      q_market_position,
      q_in_stock ? q_in_stock == 'true' : undefined,
    );

    const productIds =
      variation_type && start && end
        ? await this.ProductsService.getProductIdsFromPriceVariation(
            start,
            end,
            variation_type,
          )
        : undefined;

    const data = await this.ProductsService.insights(
      page, //because no need of page
      size, //because no need of size
      searchParams,
      sortingParams,
      categories,
      brands,
      configurations,
      productIds,
      failed_products,
      true, //no need of paginated result
    );
    // return data;
    await this.ProductsService.download(
      data,
      {
        searchOptions: { ...searchParams },
        sortingParams: { ...sortingParams },
        categories,
        brands,
        configurations,
        include_failed_products: failed_products,
        variation_type,
        in_stock: q_in_stock,
        price: q_price,
        price_comparison: q_price_comparison,
        name: q_product_name,
        code: q_product_code,
        product_code_or_name: q_product_code_or_name,
      },
      res,
    );
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.ProductsService.get(id);
  }

  @Post(':productId/category/:categoryId')
  async addCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.ProductsService.addCategory(productId, categoryId);
    return {
      message: 'Added product to the category',
    };
  }

  @Delete(':productId/category/:categoryId')
  async removeCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.ProductsService.removeCategory(productId, categoryId);
    return {
      message: 'Removed product from category',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('data') data: ProductUpdateArgs,
  ) {
    return await this.ProductsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ProductsService.remove(id);

    return {
      message: 'Deleted Successfully',
    };
  }

  @Get('product-info')
  async getProductInfo(@Query('url_key') url_key: string) {
    return await this.ProductsService.fetchProductInfo(url_key);
  }
}
