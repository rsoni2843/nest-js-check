import { BrandArgs } from './dto/brand.body';
import { Brand } from '../../database/entities/brand.entity';
export declare class BrandService {
    create(data: BrandArgs): Promise<Brand>;
    get(id: number): Promise<Brand>;
    list(page: number, size: number): Promise<{
        data: Brand[];
        totalPages: number;
    }>;
    update(id: number, data: BrandArgs): Promise<Brand>;
    delete(id: number): Promise<void>;
    getBrandsFromIdArray(idArray: number[]): Promise<string>;
}
