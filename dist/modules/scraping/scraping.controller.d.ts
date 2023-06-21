import { ScrapingService } from './scraping.service';
export declare class ScraperController {
    private readonly scraperService;
    constructor(scraperService: ScrapingService);
    scrapeData(url: string, render: boolean): Promise<any>;
    scrapeStockInfo(url: string, stock_dom_query: string, stock_pattern: string, render: boolean): Promise<any>;
}
