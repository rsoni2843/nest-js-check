import { sorting_order_type } from 'src/pipes/query-params.pipe';
import { ProductCompetitorCreateArgs, ProductCompetitorUpdateArgs } from './dto/product-competitor.body';
import { ProductCompetitorService } from './product-competitor.service';
export declare class ProductCompetitorController {
    private ProductCompetitorService;
    constructor(ProductCompetitorService: ProductCompetitorService);
    test(): Promise<{
        data: import("../../database/entities/product-competitor.entity").ProductCompetitor[];
        totalCount: number;
        totalPages: number;
    }>;
    create(data: ProductCompetitorCreateArgs): Promise<import("../../database/entities/product-competitor.entity").ProductCompetitor>;
    list(page: number, size: number, price?: sorting_order_type, created_at?: sorting_order_type, updated_at?: sorting_order_type, product_id?: number, configuration_id?: number): Promise<{
        data: import("../../database/entities/product-competitor.entity").ProductCompetitor[];
        totalPages: number;
    }>;
    get(id: number): Promise<import("../../database/entities/product-competitor.entity").ProductCompetitor>;
    update(id: number, data: ProductCompetitorUpdateArgs): Promise<import("../../database/entities/product-competitor.entity").ProductCompetitor>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
