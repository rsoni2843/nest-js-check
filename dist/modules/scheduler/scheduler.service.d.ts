import { ScrapingService } from '../scraping/scraping.service';
import { PricingLogService } from '../pricing-log/pricing-log.service';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import { ProductsService } from '../products/products.service';
import { ConfigurationService } from '../configuration/configuration.service';
export declare class SchedulerService {
    private ScrapingService;
    private PricingLogService;
    private ProductCompetitorService;
    private ProductsService;
    private ConfigurationService;
    constructor(ScrapingService: ScrapingService, PricingLogService: PricingLogService, ProductCompetitorService: ProductCompetitorService, ProductsService: ProductsService, ConfigurationService: ConfigurationService);
    hourlyTask(): Promise<void>;
    private scrapeCompetitor;
    private scrapeProduct;
}
