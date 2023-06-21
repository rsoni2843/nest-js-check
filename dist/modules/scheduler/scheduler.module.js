"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const scheduler_controller_1 = require("./scheduler.controller");
const scheduler_service_1 = require("./scheduler.service");
const common_1 = require("@nestjs/common");
const pricing_log_service_1 = require("../pricing-log/pricing-log.service");
const product_competitor_service_1 = require("../product-competitor/product-competitor.service");
const scraping_service_1 = require("../scraping/scraping.service");
const axios_1 = require("@nestjs/axios");
const configuration_service_1 = require("../configuration/configuration.service");
const products_service_1 = require("../products/products.service");
const produuct_category_service_1 = require("../product-category/produuct-category.service");
const category_service_1 = require("../category/category.service");
const brand_service_1 = require("../brand/brand.service");
const stats_service_1 = require("../stats/stats.service");
const s3_service_1 = require("../../utils/s3-service");
let SchedulerModule = class SchedulerModule {
};
SchedulerModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [scheduler_controller_1.SchedulerController],
        providers: [
            scheduler_service_1.SchedulerService,
            scraping_service_1.ScrapingService,
            pricing_log_service_1.PricingLogService,
            product_competitor_service_1.ProductCompetitorService,
            configuration_service_1.ConfigurationService,
            products_service_1.ProductsService,
            brand_service_1.BrandService,
            produuct_category_service_1.ProductCategoryService,
            category_service_1.CategoryService,
            stats_service_1.StatsService,
            s3_service_1.S3Service,
        ],
    })
], SchedulerModule);
exports.SchedulerModule = SchedulerModule;
//# sourceMappingURL=scheduler.module.js.map