"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const env_1 = __importDefault(require("../config/env"));
const category_entity_1 = require("./entities/category.entity");
const pricing_log_entity_1 = require("./entities/pricing-log.entity");
const product_entity_1 = require("./entities/product.entity");
const configuration_entity_1 = require("./entities/configuration.entity");
const product_competitor_entity_1 = require("./entities/product-competitor.entity");
const product_category_1 = require("./entities/product-category");
const processing_logs_1 = require("./entities/processing-logs");
const upload_log_1 = require("./entities/upload-log");
const dentalkart_index_entity_1 = require("./entities/dentalkart-index.entity");
const product_pricing_log_entity_1 = require("./entities/product-pricing-log.entity");
const competitor_index_1 = require("./entities/competitor-index");
const brand_entity_1 = require("./entities/brand.entity");
const user_entity_1 = require("./entities/user.entity");
const report_files_entity_1 = require("./entities/report-files.entity");
const dom_query_entity_1 = require("./entities/dom_query.entity");
exports.databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new sequelize_typescript_1.Sequelize(Object.assign(Object.assign({}, env_1.default.database), { logging: false, models: [
                    category_entity_1.Category,
                    product_competitor_entity_1.ProductCompetitor,
                    product_entity_1.Product,
                    product_category_1.ProductCategory,
                    configuration_entity_1.Configuration,
                    pricing_log_entity_1.PricingLog,
                    processing_logs_1.ProcessingLog,
                    upload_log_1.UploadLog,
                    dentalkart_index_entity_1.DentalkartIndex,
                    product_pricing_log_entity_1.ProductPricingLog,
                    competitor_index_1.CompetitorIndex,
                    brand_entity_1.Brand,
                    user_entity_1.User,
                    report_files_entity_1.ReportFiles,
                    dom_query_entity_1.DOM_Query,
                ] }));
            return sequelize;
        },
    },
];
//# sourceMappingURL=database.provider.js.map