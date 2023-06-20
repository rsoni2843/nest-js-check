import { Model } from 'sequelize-typescript';
import { Category } from './category.entity';
import { ProductCompetitor } from './product-competitor.entity';
import { ProductPricingLog } from './product-pricing-log.entity';
import { Brand } from './brand.entity';
export declare enum marketPositionType {
    CHEAPEST = "cheapest",
    AVERAGE = "average",
    COSTLIER = "costlier",
    CHEAPER = "cheaper",
    COSTLIEST = "costliest"
}
export declare class Product extends Model {
    id: number;
    name: string;
    description: string;
    categories: Category[];
    product_url: string;
    base_price: number;
    product_code: string;
    bar_code: string;
    market_position: marketPositionType;
    brand: Brand;
    brand_id: number;
    pricing_logs: ProductPricingLog[];
    product_competitors: ProductCompetitor[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    in_stock: boolean;
}
