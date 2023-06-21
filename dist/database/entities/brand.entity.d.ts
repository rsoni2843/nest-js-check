import { Model } from 'sequelize-typescript';
import { Product } from './product.entity';
export declare class Brand extends Model {
    id: number;
    name: string;
    products: Product[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
