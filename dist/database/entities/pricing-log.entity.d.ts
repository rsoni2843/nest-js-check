import { Model } from 'sequelize-typescript';
import { ProductCompetitor } from './product-competitor.entity';
export declare enum status_enum {
    SUCCESS = "success",
    FAILURE = "failure"
}
export declare class PricingLog extends Model {
    id: number;
    price_before: number;
    price_after: number;
    found_at: Date;
    product_competitor: ProductCompetitor;
    product_competitor_id: number;
    dom_query: string;
    index: number;
    status: status_enum;
}
