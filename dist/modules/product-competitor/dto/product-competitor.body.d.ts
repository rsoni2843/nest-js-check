export declare class ProductCompetitorCreateArgs {
    name: string;
    competitor_url: string;
    product_id: number;
    in_stock?: boolean;
    is_grouped: boolean;
    price_query?: boolean;
    stock_query?: boolean;
    stock_pattern?: boolean;
}
export declare class ProductCompetitorUpdateArgs {
    name?: string;
    competitor_url?: string;
    product_id?: number;
    in_stock?: boolean;
    price_query?: boolean;
    stock_query?: boolean;
    stock_pattern?: boolean;
}
