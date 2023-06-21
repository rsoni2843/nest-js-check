"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingLogService = void 0;
const common_1 = require("@nestjs/common");
const pricing_log_entity_1 = require("../../database/entities/pricing-log.entity");
const product_pricing_log_entity_1 = require("../../database/entities/product-pricing-log.entity");
const product_competitor_entity_1 = require("../../database/entities/product-competitor.entity");
let PricingLogService = class PricingLogService {
    async addCompetitorEntry(data) {
        await pricing_log_entity_1.PricingLog.create({
            product_competitor_id: data.product_competitor_id,
            price_before: data.price_before,
            price_after: data.price_after,
            dom_query: data.dom_query,
            index: data.index,
            status: data.status,
        });
    }
    async addProductEntry(data) {
        await product_pricing_log_entity_1.ProductPricingLog.create({
            product_id: data.product_id,
            price_before: data.price_before,
            price_after: data.price_after,
            status: data.status,
        });
    }
    async getCompetitorLogs(page, size, productCompetitorId) {
        const list = await pricing_log_entity_1.PricingLog.findAndCountAll({
            where: { product_competitor_id: productCompetitorId },
            limit: size,
            offset: page * size,
            order: [['found_at', 'DESC']],
        });
        return {
            data: list.rows,
            page: page,
            totalPages: Math.ceil(list.count / Number(size)),
        };
    }
    async getProductLogs(page, size, productId) {
        const list = await product_pricing_log_entity_1.ProductPricingLog.findAndCountAll({
            where: { product_id: productId },
            limit: size,
            offset: page * size,
            order: [['found_at', 'DESC']],
        });
        return {
            data: list.rows,
            page: page,
            totalPages: Math.ceil(list.count / Number(size)),
        };
    }
    async getConfigurationWiseLogs(page, size, productId) {
        const list = await pricing_log_entity_1.PricingLog.findAndCountAll({
            attributes: {
                exclude: ['dom_query', 'product_competitor_id', 'index'],
            },
            include: [
                {
                    model: product_competitor_entity_1.ProductCompetitor,
                    attributes: ['domain'],
                    where: { product_id: productId },
                },
            ],
            limit: size,
            offset: page * size,
            order: [['found_at', 'DESC']],
        });
        return {
            data: list.rows,
            page: page,
            totalPages: Math.ceil(list.count / Number(size)),
        };
    }
};
PricingLogService = __decorate([
    (0, common_1.Injectable)()
], PricingLogService);
exports.PricingLogService = PricingLogService;
//# sourceMappingURL=pricing-log.service.js.map