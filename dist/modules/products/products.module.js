"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const common_1 = require("@nestjs/common");
const produuct_category_service_1 = require("../product-category/produuct-category.service");
const category_module_1 = require("../category/category.module");
const category_service_1 = require("../category/category.service");
const axios_1 = require("@nestjs/axios");
const configuration_service_1 = require("../configuration/configuration.service");
const brand_service_1 = require("../brand/brand.service");
const stats_service_1 = require("../stats/stats.service");
const s3_service_1 = require("../../utils/s3-service");
let ProductsModule = class ProductsModule {
};
ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [category_module_1.CategoryModule, axios_1.HttpModule],
        controllers: [products_controller_1.ProductsController],
        providers: [
            products_service_1.ProductsService,
            produuct_category_service_1.ProductCategoryService,
            category_service_1.CategoryService,
            brand_service_1.BrandService,
            stats_service_1.StatsService,
            s3_service_1.S3Service,
            configuration_service_1.ConfigurationService,
        ],
    })
], ProductsModule);
exports.ProductsModule = ProductsModule;
//# sourceMappingURL=products.module.js.map