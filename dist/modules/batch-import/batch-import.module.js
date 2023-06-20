"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchImportModule = void 0;
const batch_import_controller_1 = require("./batch-import.controller");
const batch_import_service_1 = require("./batch-import.service");
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
const product_competitor_service_1 = require("../product-competitor/product-competitor.service");
const produuct_category_service_1 = require("../product-category/produuct-category.service");
const category_service_1 = require("../category/category.service");
const axios_1 = require("@nestjs/axios");
const scraping_service_1 = require("../scraping/scraping.service");
const configuration_service_1 = require("../configuration/configuration.service");
const s3_service_1 = require("../../utils/s3-service");
const brand_service_1 = require("../brand/brand.service");
const stats_service_1 = require("../stats/stats.service");
let BatchImportModule = class BatchImportModule {
};
BatchImportModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [batch_import_controller_1.BatchImportController],
        providers: [
            batch_import_service_1.BatchImportService,
            brand_service_1.BrandService,
            products_service_1.ProductsService,
            configuration_service_1.ConfigurationService,
            category_service_1.CategoryService,
            produuct_category_service_1.ProductCategoryService,
            scraping_service_1.ScrapingService,
            product_competitor_service_1.ProductCompetitorService,
            s3_service_1.S3Service,
            stats_service_1.StatsService,
        ],
    })
], BatchImportModule);
exports.BatchImportModule = BatchImportModule;
//# sourceMappingURL=batch-import.module.js.map