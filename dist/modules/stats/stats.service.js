"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const brand_entity_1 = require("../../database/entities/brand.entity");
const competitor_index_1 = require("../../database/entities/competitor-index");
const configuration_entity_1 = require("../../database/entities/configuration.entity");
const dentalkart_index_entity_1 = require("../../database/entities/dentalkart-index.entity");
const product_competitor_entity_1 = require("../../database/entities/product-competitor.entity");
const product_pricing_log_entity_1 = require("../../database/entities/product-pricing-log.entity");
const product_entity_1 = require("../../database/entities/product.entity");
let StatsService = class StatsService {
    async getTrackingSummary() {
        const brandCount = await brand_entity_1.Brand.count();
        const competitorCount = await configuration_entity_1.Configuration.count();
        const productCount = await product_entity_1.Product.count();
        return { brandCount, competitorCount, productCount };
    }
    async getMarketStats() {
        const [result] = await product_entity_1.Product.sequelize.query(`SELECT 
            market_position,
            COUNT(*) AS count,
            CAST(COUNT(*) * 100 / (SELECT COUNT(*) FROM product WHERE market_position IS NOT NULL AND deleted_at IS NULL) As DECIMAL(5,2)) AS percentage
          FROM product
          WHERE market_position IS NOT NULL AND deleted_at IS NULL
          GROUP BY market_position WITH ROLLUP`);
        const stats = {};
        let totalCount = 0;
        for (const row of result) {
            if (row.market_position) {
                stats[row.market_position] = {
                    count: row.count,
                    percentage: row.percentage,
                };
                totalCount += row.count;
            }
        }
        return { stats, totalCount };
    }
    async getCurrentIndex() {
        const index = await dentalkart_index_entity_1.DentalkartIndex.findOne({
            order: [['found_at', 'DESC']],
            limit: 1,
        });
        return index || null;
    }
    async getCompetitorHistoricalIndex(range, startDate, endDate) {
        const list = await competitor_index_1.CompetitorIndex.findAll({
            include: [{ model: configuration_entity_1.Configuration, attributes: ['domain'], where: {} }],
            where: {
                found_at: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            order: [['found_at', 'ASC']],
        });
        const data = list.reduce((acc, item) => {
            if (!acc[item.configuration.domain]) {
                acc[item.configuration.domain] = [];
            }
            acc[item.configuration.domain].push({
                index: item.index,
                found_at: item.found_at,
            });
            return acc;
        }, {});
        return data;
    }
    async getCompetitorIndex(range, startDate, endDate) {
        const competitorList = await configuration_entity_1.Configuration.findAll({
            attributes: ['domain'],
        });
        const competitorCount = await product_competitor_entity_1.ProductCompetitor.count({
            group: ['domain'],
        });
        let competitorCountObj = {};
        let data = [];
        for (let comp of competitorList) {
            competitorCountObj[comp.domain] = 0;
        }
        for (let comp of competitorCount) {
            competitorCountObj[comp.domain] = comp.count;
        }
        const competitors = await configuration_entity_1.Configuration.findAndCountAll({
            attributes: ['id', 'domain'],
            group: ['domain'],
        });
        for (let comp of competitors.rows) {
            let info = await competitor_index_1.CompetitorIndex.findOne({
                order: [['found_at', 'DESC']],
                include: [{ model: configuration_entity_1.Configuration, attributes: ['domain'] }],
                where: {
                    configuration_id: comp.id,
                },
            });
            if (info === null || info === void 0 ? void 0 : info.configuration) {
                data.push({
                    domain: info.configuration.domain,
                    index: info.index,
                    count: competitorCountObj[info.configuration.domain],
                });
            }
        }
        const presentDomains = competitorList.reduce((acc, item) => {
            acc[item.domain] = false;
            return acc;
        }, {});
        for (let item of data) {
            presentDomains[item.domain] = true;
        }
        for (let domain in presentDomains) {
            if (!presentDomains[domain]) {
                data.push({
                    domain: domain,
                    index: 0,
                    count: 0,
                });
            }
        }
        return data;
    }
    async getDentalkartHistoricalIndex(range, startDate, endDate) {
        const dentalkartIndexHistory = await dentalkart_index_entity_1.DentalkartIndex.findAll({
            where: {
                found_at: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
            },
            order: [['found_at', 'ASC']],
        });
        return dentalkartIndexHistory;
    }
    async getPriceVariation(start, end, getDbResult) {
        const logs = await product_pricing_log_entity_1.ProductPricingLog.findAll({
            attributes: [
                'product_id',
                [
                    sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal('CASE WHEN price_after > price_before THEN true ELSE false END')),
                    'price_increase',
                ],
                [
                    sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.literal('CASE WHEN price_after < price_before THEN true ELSE false END')),
                    'price_decrease',
                ],
            ],
            include: [
                { model: product_entity_1.Product, attributes: [], where: { deleted_at: null } },
            ],
            group: ['product_id'],
            where: {
                found_at: {
                    [sequelize_1.Op.between]: [start, end],
                },
            },
        });
        if (getDbResult)
            return logs;
        const data = logs.reduce((acc, item) => {
            if (item.dataValues['price_decrease'] != '0') {
                acc = Object.assign(Object.assign({}, acc), { decrease_count: acc.decrease_count + 1 });
            }
            if (item.dataValues['price_increase'] != '0') {
                acc = Object.assign(Object.assign({}, acc), { increase_count: acc.increase_count + 1 });
            }
            return acc;
        }, {
            increase_count: 0,
            decrease_count: 0,
        });
        return data;
    }
    async getOutOfStockInfo() {
        const dentalkart = await product_entity_1.Product.count({
            where: {
                in_stock: false,
            },
        });
        const competitor = await product_competitor_entity_1.ProductCompetitor.count({
            where: {
                in_stock: false,
            },
        });
        return { dentalkart, competitor };
    }
};
StatsService = __decorate([
    (0, common_1.Injectable)()
], StatsService);
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map