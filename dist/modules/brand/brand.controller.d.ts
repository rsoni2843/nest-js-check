import { BrandService } from './brand.service';
import { BrandArgs } from './dto/brand.body';
export declare class BrandController {
    private BrandService;
    constructor(BrandService: BrandService);
    create(data: BrandArgs): Promise<{
        message: string;
        category: import("../../database/entities/brand.entity").Brand;
    }>;
    list(page: number, size: number): Promise<{
        data: import("../../database/entities/brand.entity").Brand[];
        totalPages: number;
    }>;
    get(id: number): Promise<import("../../database/entities/brand.entity").Brand>;
    update(id: number, data: BrandArgs): Promise<import("../../database/entities/brand.entity").Brand>;
    deleteCategory(id: number): Promise<{
        message: string;
    }>;
}
