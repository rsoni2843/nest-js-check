import { CategoryArgs } from './dto/category.body';
import { Category } from '../../database/entities/category.entity';
export declare class CategoryService {
    create(data: CategoryArgs): Promise<Category>;
    get(id: number): Promise<Category>;
    list(page: number, size: number): Promise<{
        data: Category[];
        totalPages: number;
    }>;
    update(id: number, data: CategoryArgs): Promise<Category>;
    deleteCategory(id: number): Promise<void>;
    getCategoriesFromIdArray(idArray: number[]): Promise<string>;
}
