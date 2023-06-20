import { Response } from 'express';
import { sorting_order_type } from 'src/pipes/query-params.pipe';
import { ProductCreateArgs, ProductUpdateArgs } from './dto/product.body';
import { ProductsService, price_variation_enum } from './products.service';
import { marketPositionType } from 'src/database/entities/product.entity';
export declare class ProductsController {
    private ProductsService;
    constructor(ProductsService: ProductsService);
    create(data: ProductCreateArgs): Promise<import("src/database/entities/product.entity").Product>;
    list(page: number, size: number, category_id: number, brand_id: number, configuration_id: number, price: sorting_order_type, product_code: sorting_order_type, name: sorting_order_type, competitor_count: sorting_order_type, created_at: sorting_order_type, q_market_position: marketPositionType | undefined, q_product_code_or_name: string, q_product_code: string, q_product_name: string, q_price: string, q_price_comparison: string, q_in_stock: string, failed_products: boolean): Promise<{
        data: import("src/database/entities/product.entity").Product[];
        totalCount: number;
        totalPages: number;
    }>;
    insightList(page: number, size: number, variation_type: price_variation_enum | undefined, start: Date, end: Date, categories: number[], brands: number[], configurations: number[], price: sorting_order_type, product_code: sorting_order_type, name: sorting_order_type, competitor_count: sorting_order_type, created_at: sorting_order_type, q_market_position: marketPositionType | undefined, q_product_code_or_name: string, q_product_code: string, q_product_name: string, q_price: string, q_price_comparison: string, q_in_stock: string, q_competitor_in_stock: string, failed_products: boolean): Promise<any>;
    download(res: Response, page: number, size: number, variation_type: price_variation_enum | undefined, start: Date, end: Date, categories: number[], brands: number[], configurations: number[], price: sorting_order_type, product_code: sorting_order_type, name: sorting_order_type, competitor_count: sorting_order_type, created_at: sorting_order_type, q_market_position: marketPositionType | undefined, q_product_code_or_name: string, q_product_code: string, q_product_name: string, q_price: string, q_price_comparison: string, q_in_stock: string, failed_products: boolean): Promise<void>;
    get(id: number): Promise<import("src/database/entities/product.entity").Product>;
    addCategory(productId: number, categoryId: number): Promise<{
        message: string;
    }>;
    removeCategory(productId: number, categoryId: number): Promise<{
        message: string;
    }>;
    update(id: number, data: ProductUpdateArgs): Promise<import("src/database/entities/product.entity").Product>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getProductInfo(url_key: string): Promise<any>;
}
