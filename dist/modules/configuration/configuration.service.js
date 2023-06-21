"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const configuration_entity_1 = require("../../database/entities/configuration.entity");
const domain_helper_1 = require("../../utils/domain-helper");
const product_competitor_entity_1 = require("../../database/entities/product-competitor.entity");
const sequelize_1 = require("sequelize");
const product_entity_1 = require("../../database/entities/product.entity");
const dom_query_entity_1 = require("../../database/entities/dom_query.entity");
let ConfigurationService = class ConfigurationService {
    async create(data) {
        const domain = (0, domain_helper_1.getDomain)(data.base_url);
        if (!domain)
            throw new common_1.BadGatewayException('invalid url');
        const existingConfiguration = await this.getByDomain(domain);
        if (existingConfiguration)
            throw new common_1.BadGatewayException('configuration with this domain already exists!');
        const configuration = await configuration_entity_1.Configuration.create({
            base_url: data.base_url,
            domain: domain,
            price_dom_query: data.dom_query,
            stock_dom_query: data.stock_dom_query,
            stock_pattern: data.stock_pattern.trim(),
            jsRendering: data.jsRendering || false,
        });
        const query = await dom_query_entity_1.DOM_Query.create({
            price_query: data.dom_query,
            stock_query: data.stock_dom_query,
            stock_pattern: data.stock_pattern.trim(),
            query_type: dom_query_entity_1.query_type.DEFAULT,
            configuration_id: configuration.id,
        });
        return configuration;
    }
    async completeListForScraping() {
        return await configuration_entity_1.Configuration.findAll();
    }
    async get(id) {
        const configuration = await configuration_entity_1.Configuration.findByPk(id);
        if (!configuration)
            throw new common_1.BadRequestException('unable to get configuration');
        return configuration;
    }
    async update(id, data) {
        const configuration = await this.get(id);
        configuration.set(Object.assign({}, data));
        if (data === null || data === void 0 ? void 0 : data.base_url) {
            const newDomain = (0, domain_helper_1.getDomain)(data.base_url);
            const query = await dom_query_entity_1.DOM_Query.findOne({
                where: {
                    configuration_id: configuration.id,
                    query_type: dom_query_entity_1.query_type.DEFAULT,
                },
            });
            let hasQueryUpdated = false;
            if (data.dom_query && data.dom_query != query.price_query) {
                query.set({ price_query: data.dom_query });
                hasQueryUpdated = true;
            }
            if (data.stock_dom_query && data.stock_dom_query != query.stock_query) {
                query.set({ stock_query: data.stock_dom_query });
                hasQueryUpdated = true;
            }
            if (data.stock_pattern && data.stock_pattern != query.stock_pattern) {
                query.set({ stock_pattern: data.stock_pattern.trim() });
                hasQueryUpdated = true;
            }
            hasQueryUpdated && (await query.save());
            configuration.set({
                domain: newDomain,
                base_url: data.base_url,
                price_dom_query: query.price_query,
                stock_dom_query: query.stock_query,
                stock_pattern: query.stock_pattern.trim(),
            });
        }
        await configuration.save();
        return configuration;
    }
    async list(page, size, includeCompetitorCount) {
        const count = await configuration_entity_1.Configuration.count();
        const attributes = [
            'id',
            'domain',
            'base_url',
            'is_active',
            'created_at',
            'updated_at',
        ];
        if (includeCompetitorCount)
            attributes.push([
                sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('product_competitors.id')),
                'competitor_count',
            ]);
        const configurationList = await configuration_entity_1.Configuration.findAll({
            attributes: attributes,
            include: [
                {
                    model: product_competitor_entity_1.ProductCompetitor,
                    attributes: [],
                    include: [
                        {
                            model: product_entity_1.Product,
                            where: { deleted_at: null },
                        },
                    ],
                },
            ],
            group: ['id'],
            order: [['created_at', 'DESC']],
            offset: page * size,
        });
        return {
            data: configurationList.slice(0, size > configurationList.length ? configurationList.length : size),
            totalPages: Math.ceil(count / Number(size)),
        };
    }
    async remove(id) {
        const config = await this.get(id);
        const competitors = await product_competitor_entity_1.ProductCompetitor.findAll({
            where: { configuration_id: config.id },
        });
        for (let comp of competitors) {
            await comp.destroy({ force: true });
        }
        await config.destroy();
    }
    async getByDomain(domain) {
        const configuration = await configuration_entity_1.Configuration.findOne({
            where: {
                domain: domain,
            },
            include: [{ model: dom_query_entity_1.DOM_Query }],
        });
        return configuration;
    }
    async getConfigurationsFromIdArray(idArray) {
        const configurations = await configuration_entity_1.Configuration.findAll({
            attributes: ['id', 'domain'],
            where: {
                id: {
                    [sequelize_1.Op.in]: idArray,
                },
            },
        });
        return configurations.map((b) => b.domain).join(' ');
    }
};
ConfigurationService = __decorate([
    (0, common_1.Injectable)()
], ConfigurationService);
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=configuration.service.js.map