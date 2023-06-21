import { PricingLogService } from './pricing-log.service';
export declare class PricingLogController {
    private PricingLogService;
    constructor(PricingLogService: PricingLogService);
    getProductLogs(productId: number, page: number, size: number): Promise<{
        data: import("../../database/entities/product-pricing-log.entity").ProductPricingLog[];
        page: number;
        totalPages: number;
    }>;
    getCompetitorLogs(productCompetitorId: number, page: number, size: number): Promise<{
        data: import("../../database/entities/pricing-log.entity").PricingLog[];
        page: number;
        totalPages: number;
    }>;
    getProductSummary(productId: number, page: number, size: number): Promise<{
        data: import("../../database/entities/pricing-log.entity").PricingLog[];
        page: number;
        totalPages: number;
    }>;
}
