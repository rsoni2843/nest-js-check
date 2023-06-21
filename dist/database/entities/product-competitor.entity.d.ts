import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
import { Configuration } from './configuration.entity';
import { PricingLog } from './pricing-log.entity';
import { DOM_Query } from './dom_query.entity';
export declare class ProductCompetitor extends Model {
    id: number;
    name: string;
    domain: string;
    competitor_url: string;
    price: number;
    in_stock: boolean;
    product: Product;
    product_id: number;
    configuration: Configuration;
    configuration_id: number;
    dom_query: DOM_Query;
    dom_query_id: number;
    pricing_logs: PricingLog[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
