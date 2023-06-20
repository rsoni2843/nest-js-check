import { DentalkartIndex } from 'src/database/entities/dentalkart-index.entity';
import { ProductPricingLog } from 'src/database/entities/product-pricing-log.entity';
export declare class StatsService {
    getTrackingSummary(): Promise<{
        brandCount: number;
        competitorCount: number;
        productCount: number;
    }>;
    getMarketStats(): Promise<{
        stats: {};
        totalCount: number;
    }>;
    getCurrentIndex(): Promise<DentalkartIndex>;
    getCompetitorHistoricalIndex(range: number, startDate: Date, endDate: Date): Promise<{}>;
    getCompetitorIndex(range: number, startDate: Date, endDate: Date): Promise<any[]>;
    getDentalkartHistoricalIndex(range: number, startDate: Date, endDate: Date): Promise<DentalkartIndex[]>;
    getPriceVariation(start: Date, end: Date, getDbResult?: boolean): Promise<ProductPricingLog[] | {
        increase_count: number;
        decrease_count: number;
    }>;
    getOutOfStockInfo(): Promise<{
        dentalkart: number;
        competitor: number;
    }>;
}
