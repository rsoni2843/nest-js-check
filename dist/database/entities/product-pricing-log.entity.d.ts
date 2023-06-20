import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
export declare enum status_enum {
    SUCCESS = "success",
    FAILURE = "failure"
}
export declare class ProductPricingLog extends Model {
    id: number;
    product: Product;
    product_id: number;
    price_before: number;
    price_after: number;
    found_at: Date;
    status: status_enum;
}
