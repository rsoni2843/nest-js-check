import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
import { Category } from './category.entity';
export declare class ProductCategory extends Model {
    id: number;
    product: Product;
    product_id: number;
    category: Category;
    category_id: number;
    created_at: Date;
    updated_at: Date;
}
