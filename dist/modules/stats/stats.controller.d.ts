import { StatsService } from './stats.service';
export declare class StatsController {
    private StatsService;
    constructor(StatsService: StatsService);
    getTrackingSummary(): Promise<{
        brandCount: number;
        competitorCount: number;
        productCount: number;
    }>;
    getMarketPostionStats(): Promise<{
        stats: {};
        totalCount: number;
    }>;
    getDentalkartIndex(): Promise<import("../../database/entities/dentalkart-index.entity").DentalkartIndex>;
    getCompetitorIndex(range: number, startDate: Date, endDate: Date): Promise<any[]>;
    dentalkartHistoricalIndex(range: number, startDate: Date, endDate: Date): Promise<import("../../database/entities/dentalkart-index.entity").DentalkartIndex[]>;
    competitorHistoricalIndex(range: number, startDate: Date, endDate: Date): Promise<{}>;
    priceVariation(start: Date, end: Date): Promise<import("../../database/entities/product-pricing-log.entity").ProductPricingLog[] | {
        increase_count: number;
        decrease_count: number;
    }>;
    outOfStock(): Promise<{
        dentalkart: number;
        competitor: number;
    }>;
}
