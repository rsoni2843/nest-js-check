import { ProductCompetitorCreateArgs, ProductCompetitorUpdateArgs } from './dto/product-competitor.body';
import { ConfigurationService } from '../configuration/configuration.service';
import { ProductCompetitor } from '../../database/entities/product-competitor.entity';
import { ProductsService } from '../products/products.service';
import { ScrapingService } from '../scraping/scraping.service';
import { Literal } from 'sequelize/types/utils';
import { sorting_order, sorting_order_type } from 'src/pipes/query-params.pipe';
export declare class ProductCompetitorService {
    private ConfigurationService;
    private ProductsService;
    private ScrapingService;
    constructor(ConfigurationService: ConfigurationService, ProductsService: ProductsService, ScrapingService: ScrapingService);
    create(data: ProductCompetitorCreateArgs): Promise<ProductCompetitor>;
    updateInStockStatus(competitorId: number, inStock: boolean): Promise<void>;
    get(id: number): Promise<ProductCompetitor>;
    list(page: number, size: number, sorting_order: [Literal, sorting_order], productId?: number, configurationId?: number): Promise<{
        data: ProductCompetitor[];
        totalPages: number;
    }>;
    update(id: number, data: ProductCompetitorUpdateArgs): Promise<ProductCompetitor>;
    completeListForScraping(page: number): Promise<{
        data: ProductCompetitor[];
        totalCount: number;
        totalPages: number;
    }>;
    remove(id: number): Promise<void>;
    getSortingParams(priceOrder: sorting_order_type, createdAtOrder: sorting_order_type, updatedAtOrder: sorting_order_type): [Literal, sorting_order];
}
