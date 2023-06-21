import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
export declare class Category extends Model {
    id: number;
    title: string;
    description: string;
    products: Product[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
