"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const scraping_service_1 = require("../scraping/scraping.service");
const pricing_log_service_1 = require("../pricing-log/pricing-log.service");
const product_competitor_service_1 = require("../product-competitor/product-competitor.service");
const pricing_log_entity_1 = require("../../database/entities/pricing-log.entity");
const products_service_1 = require("../products/products.service");
const dentalkart_index_entity_1 = require("../../database/entities/dentalkart-index.entity");
const p_limit_1 = __importDefault(require("p-limit"));
const configuration_service_1 = require("../configuration/configuration.service");
const competitor_index_1 = require("../../database/entities/competitor-index");
let SchedulerService = class SchedulerService {
    constructor(ScrapingService, PricingLogService, ProductCompetitorService, ProductsService, ConfigurationService) {
        this.ScrapingService = ScrapingService;
        this.PricingLogService = PricingLogService;
        this.ProductCompetitorService = ProductCompetitorService;
        this.ProductsService = ProductsService;
        this.ConfigurationService = ConfigurationService;
    }
    async hourlyTask() {
        const limit = (0, p_limit_1.default)(5);
        console.log('scheduler started...');
        let page = 0;
        let productList = await this.ProductsService.completeListForScraping(page);
        let promises = productList.data.map((product) => limit(() => this.scrapeProduct(product)));
        while (page < productList.totalPages) {
            await Promise.all(promises);
            productList = await this.ProductsService.completeListForScraping(page + 1);
            promises = productList.data.map((product) => limit(() => this.scrapeProduct(product)));
            page++;
        }
        page = 0;
        let competitorList = await this.ProductCompetitorService.completeListForScraping(page);
        if (competitorList.totalCount == 0) {
            return;
        }
        const indexObjectMapper = (acc, indexVal) => {
            var _a, _b;
            if (indexVal.index == 0) {
                return acc;
            }
            if (!acc[indexVal.competitorDomain]) {
                acc[indexVal.competitorDomain] = {
                    sum: 0,
                    count: 0,
                };
            }
            return {
                sum: acc.sum + Math.pow(indexVal.index, -1),
                count: acc.count + 1,
                competitors: Object.assign(Object.assign({}, acc.competitors), { [indexVal.competitorDomain]: Object.assign(Object.assign({}, acc.competitors[indexVal.competitorDomain]), { sum: ((_a = acc.competitors[indexVal.competitorDomain]) === null || _a === void 0 ? void 0 : _a.sum) ||
                            0 + indexVal.index, count: ((_b = acc.competitors[indexVal.competitorDomain]) === null || _b === void 0 ? void 0 : _b.count) || 0 + 1 }) }),
            };
        };
        let competitorIndicesData = {
            sum: 0,
            count: 0,
            competitors: {},
        };
        while (page < competitorList.totalPages) {
            let indexes = await Promise.all(competitorList.data.reduce((acc, competitor) => {
                if (competitor.configuration && competitor.configuration.is_active)
                    acc.push(limit(() => this.scrapeCompetitor(competitor)));
                return acc;
            }, []));
            competitorIndicesData = indexes.reduce(indexObjectMapper, competitorIndicesData);
            competitorList =
                await this.ProductCompetitorService.completeListForScraping(page + 1);
            page++;
        }
        const { sum, count, competitors } = competitorIndicesData;
        const dentalkartIndex = (sum / count) * 100;
        await dentalkart_index_entity_1.DentalkartIndex.create({
            index: dentalkartIndex,
        });
        const competitorDomains = Object.keys(competitors);
        for (let i = 0; i < competitorDomains.length; i++) {
            const domain = competitorDomains[i];
            const indexVal = competitors[domain];
            const configuration = await this.ConfigurationService.getByDomain(domain);
            if (configuration) {
                await competitor_index_1.CompetitorIndex.create({
                    index: (indexVal.sum / indexVal.count) * 100,
                    configuration_id: configuration.id,
                });
            }
        }
        console.log('scheduler completed');
    }
    scrapeCompetitor(competitor) {
        console.log('scraper regested for competitor id : ', competitor.id);
        return new Promise(async (resolve, reject) => {
            let index = 0;
            try {
                const configuration = competitor.configuration;
                const htmlRawData = await this.ScrapingService.scrapeData(competitor.competitor_url, configuration.jsRendering);
                if (!htmlRawData) {
                    throw new Error('Html not present');
                }
                const stockStatus = await this.ScrapingService.getStockInfo(htmlRawData, competitor.dom_query.stock_query, competitor.dom_query.stock_pattern);
                const currentPrice = await this.ScrapingService.getPrice(htmlRawData, competitor.dom_query.price_query);
                if (!currentPrice) {
                    throw new Error();
                }
                const previousPrice = competitor.price;
                await this.PricingLogService.addCompetitorEntry({
                    price_before: previousPrice,
                    price_after: currentPrice,
                    product_id: competitor.product_id,
                    product_competitor_id: competitor.id,
                    dom_query: competitor.dom_query.price_query,
                    status: pricing_log_entity_1.status_enum.SUCCESS,
                    index: competitor.product.base_price / currentPrice,
                });
                index = competitor.product.base_price / currentPrice;
                let hasPriceUpdated = false;
                let hasStockUpdated = false;
                if (previousPrice != currentPrice) {
                    hasPriceUpdated = true;
                    competitor.set({ price: currentPrice });
                }
                if (stockStatus != competitor.in_stock) {
                    hasStockUpdated = true;
                    competitor.set({ in_stock: stockStatus });
                }
                if (hasPriceUpdated || hasStockUpdated) {
                    await competitor.save();
                }
            }
            catch (error) {
                await this.PricingLogService.addCompetitorEntry({
                    price_before: competitor.price,
                    price_after: competitor.price,
                    product_id: competitor.product_id,
                    product_competitor_id: competitor.id,
                    dom_query: competitor.dom_query.price_query,
                    status: pricing_log_entity_1.status_enum.FAILURE,
                });
            }
            resolve({
                index: index,
                competitorDomain: competitor.domain,
            });
        });
    }
    scrapeProduct(product) {
        return new Promise(async (resolve, reject) => {
            try {
                const productInfo = await this.ProductsService.fetchProductInfo(product.product_url);
                if (!productInfo) {
                    throw new Error();
                }
                await this.PricingLogService.addProductEntry({
                    price_before: product.base_price,
                    price_after: productInfo.price,
                    product_id: product.id,
                    status: pricing_log_entity_1.status_enum.SUCCESS,
                });
                if (product.base_price != productInfo.price) {
                    await this.ProductsService.update(product.id, {
                        base_price: productInfo.price,
                        product_url: product.product_url,
                    });
                }
                await this.ProductsService.updateInStock(product, productInfo.is_in_stock);
            }
            catch (error) {
                await this.PricingLogService.addProductEntry({
                    price_before: product.base_price,
                    price_after: product.base_price,
                    product_id: product.id,
                    status: pricing_log_entity_1.status_enum.FAILURE,
                });
            }
            resolve();
        });
    }
};
SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scraping_service_1.ScrapingService,
        pricing_log_service_1.PricingLogService,
        product_competitor_service_1.ProductCompetitorService,
        products_service_1.ProductsService,
        configuration_service_1.ConfigurationService])
], SchedulerService);
exports.SchedulerService = SchedulerService;
//# sourceMappingURL=scheduler.service.js.map