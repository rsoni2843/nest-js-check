import { HttpService } from '@nestjs/axios';
export declare class ScrapingService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getPrice(htmlRawData: string | null, dom_query: string): Promise<number>;
    getStockInfo(htmlRawData: string | null, stockDomQuery: string, stockPattern: string | null): Promise<boolean>;
    private extractPattern;
    private isElementPresent;
    private getElementContent;
    scrapeData(url: string, render: boolean): Promise<any>;
    private getHTML;
    private executeQuery;
    private extractPrice;
}
