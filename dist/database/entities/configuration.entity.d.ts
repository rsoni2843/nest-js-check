import { ProductCompetitor } from './product-competitor.entity';
import { Model } from 'sequelize-typescript';
import { CompetitorIndex } from './competitor-index';
import { DOM_Query } from './dom_query.entity';
export declare enum queryType {
    PRICE = "price",
    STOCK = "stock"
}
export declare class Configuration extends Model {
    id: number;
    price_dom_query: string;
    stock_dom_query: string;
    stock_pattern: string;
    domain: string;
    base_url: string;
    jsRendering: boolean;
    is_active: boolean;
    dom_queries: DOM_Query[];
    product_competitors: ProductCompetitor[];
    competitor_indices: CompetitorIndex[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
