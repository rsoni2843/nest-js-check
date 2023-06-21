import { addEntryInterface } from './dto/add-entry';
import { PricingLog } from 'src/database/entities/pricing-log.entity';
import { ProductPricingLog } from 'src/database/entities/product-pricing-log.entity';
export declare class PricingLogService {
    addCompetitorEntry(data: addEntryInterface): Promise<void>;
    addProductEntry(data: addEntryInterface): Promise<void>;
    getCompetitorLogs(page: number, size: number, productCompetitorId: number): Promise<{
        data: PricingLog[];
        page: number;
        totalPages: number;
    }>;
    getProductLogs(page: number, size: number, productId: number): Promise<{
        data: ProductPricingLog[];
        page: number;
        totalPages: number;
    }>;
    getConfigurationWiseLogs(page: number, size: number, productId: number): Promise<{
        data: PricingLog[];
        page: number;
        totalPages: number;
    }>;
}
