import { CategoryService } from './category.service';
import { CategoryArgs } from './dto/category.body';
export declare class CategoryController {
    private CategoryService;
    constructor(CategoryService: CategoryService);
    create(data: CategoryArgs): Promise<{
        message: string;
        category: import("../../database/entities/category.entity").Category;
    }>;
    list(page: number, size: number): Promise<{
        data: import("../../database/entities/category.entity").Category[];
        totalPages: number;
    }>;
    get(id: number): Promise<import("../../database/entities/category.entity").Category>;
    update(id: number, data: CategoryArgs): Promise<import("../../database/entities/category.entity").Category>;
    deleteCategory(id: number): Promise<{
        message: string;
    }>;
}
