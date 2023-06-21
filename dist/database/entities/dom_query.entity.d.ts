import { Model } from 'sequelize-typescript';
import { Configuration } from './configuration.entity';
import { ProductCompetitor } from './product-competitor.entity';
export declare enum query_type {
    DEFAULT = "default",
    GROUPED = "grouped"
}
export declare class DOM_Query extends Model {
    id: number;
    price_query: string;
    stock_query: string;
    stock_pattern: string;
    query_type: string;
    configuration: Configuration;
    configuration_id: number;
    product_competitors: ProductCompetitor[];
    created_at: Date;
    updated_at: Date;
}
