export declare class ProductCategoryService {
    create(productId: number, categoryId: number): Promise<void>;
    update(productId: number, categoryId: number): Promise<void>;
    remove(productId: number, categoryId: number): Promise<void>;
}
