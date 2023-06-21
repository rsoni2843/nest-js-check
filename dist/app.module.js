"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const report_files_module_1 = require("./modules/report-files/report-files.module");
const pricing_log_module_1 = require("./modules/pricing-log/pricing-log.module");
const brand_module_1 = require("./modules/brand/brand.module");
const upload_logs_module_1 = require("./modules/upload-logs/upload-logs.module");
const batch_import_module_1 = require("./modules/batch-import/batch-import.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const scraping_module_1 = require("./modules/scraping/scraping.module");
const configuration_module_1 = require("./modules/configuration/configuration.module");
const product_competitor_module_1 = require("./modules/product-competitor/product-competitor.module");
const product_category_module_1 = require("./modules/product-category/product-category.module");
const category_module_1 = require("./modules/category/category.module");
const products_module_1 = require("./modules/products/products.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const core_1 = require("@nestjs/core");
const filters_1 = require("./filters");
const schedule_1 = require("@nestjs/schedule");
const platform_express_1 = require("@nestjs/platform-express");
const stats_module_1 = require("./modules/stats/stats.module");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./modules/auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            report_files_module_1.ReportFilesModule,
            pricing_log_module_1.PricingLogModule,
            brand_module_1.BrandModule,
            upload_logs_module_1.UploadLogsModule,
            batch_import_module_1.BatchImportModule,
            schedule_1.ScheduleModule.forRoot(),
            platform_express_1.MulterModule.register({ dest: './uploads' }),
            scheduler_module_1.SchedulerModule,
            scraping_module_1.ScrapingModule,
            configuration_module_1.ConfigurationModule,
            product_competitor_module_1.ProductCompetitorModule,
            product_category_module_1.ProductCategoryModule,
            category_module_1.CategoryModule,
            products_module_1.ProductsModule,
            database_module_1.DatabaseModule,
            stats_module_1.StatsModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: common_1.ValidationPipe,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map