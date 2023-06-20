import { ProductCreateArgs, ProductUpdateArgs } from './dto/product.body';
import { Product, marketPositionType } from 'src/database/entities/product.entity';
import { ProductCategoryService } from '../product-category/produuct-category.service';
import { CategoryService } from '../category/category.service';
import { HttpService } from '@nestjs/axios';
import { sorting_order, sorting_order_type } from 'src/pipes/query-params.pipe';
import { Literal } from 'sequelize/types/utils';
import { BrandService } from '../brand/brand.service';
import { StatsService } from '../stats/stats.service';
import { Response } from 'express';
import { S3Service } from '../../utils/s3-service';
import { ConfigurationService } from '../configuration/configuration.service';
export declare enum price_variation_enum {
    INCREASE = "increase",
    DECREASE = "decrease"
}
export declare class ProductsService {
    private ProductCategoryService;
    private CategoryService;
    private httpService;
    private BrandService;
    private StatsService;
    private ConfigurationService;
    private S3Service;
    constructor(ProductCategoryService: ProductCategoryService, CategoryService: CategoryService, httpService: HttpService, BrandService: BrandService, StatsService: StatsService, ConfigurationService: ConfigurationService, S3Service: S3Service);
    create(data: ProductCreateArgs): Promise<Product>;
    update(id: number, data: ProductUpdateArgs): Promise<Product>;
    get(id: number, includeCompetitors?: boolean): Promise<Product>;
    list(page: number, size: number, sorting_order: [Literal, sorting_order], searchParams: any, category_id?: number, brand_id?: number, configuration_id?: number, includeProductswithFailedScraping?: boolean): Promise<{
        data: Product[];
        totalCount: number;
        totalPages: number;
    }>;
    insights(page: number, size: number, searchParams: any, sorting_order: [Literal, sorting_order], categories: number[], brands: number[], configurations: number[], products: number[], includeProductswithFailedScraping: boolean, getCompleteList: boolean): Promise<any>;
    download(data: Product[], filterOptions: {
        [key: string]: any;
    }, res: Response): Promise<void>;
    getProductIdsFromPriceVariation(start: Date, end: Date, variation_type: price_variation_enum): Promise<any>;
    completeListForScraping(page: number): Promise<{
        data: Product[];
        totalCount: number;
        totalPages: number;
    }>;
    remove(id: number): Promise<void>;
    updateMarketPosition(product: Product): Promise<void>;
    addCategory(product_id: number, category_id: number): Promise<void>;
    removeCategory(product_id: number, category_id: number): Promise<void>;
    updateInStock(product: Product, inStock: boolean): Promise<void>;
    getSortingParams(priceOrder: sorting_order_type, productCodeOrder: sorting_order_type, nameOrder: sorting_order_type, competitorCountOrder: sorting_order_type, createdAtOrder: sorting_order_type, marketPosition: marketPositionType | undefined): [Literal, sorting_order];
    getSearchParams(product_code_or_name: string | undefined, product_code: string | undefined, product_name: string | undefined, price: string | undefined, price_comparison: string | undefined, market_position: string | undefined, in_stock: boolean | undefined): any;
    fetchProductInfo(product_url: string): Promise<any>;
}
