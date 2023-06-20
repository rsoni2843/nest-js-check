export declare class ProductCreateArgs {
    name?: string;
    base_price?: number;
    product_code: string;
    bar_code?: number;
    description?: string;
    product_url: string;
    brand_id: number;
    category_id?: number;
    in_stock?: boolean;
}
export declare class ProductUpdateArgs {
    name?: string;
    base_price?: number;
    product_code?: string;
    bar_code?: number;
    description?: string;
    brand_id?: number;
    product_url?: string;
    in_stock?: boolean;
    category_id?: number;
}
