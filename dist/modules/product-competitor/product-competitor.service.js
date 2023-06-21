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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCompetitorService = void 0;
const common_1 = require("@nestjs/common");
const domain_helper_1 = require("../../utils/domain-helper");
const configuration_service_1 = require("../configuration/configuration.service");
const product_competitor_entity_1 = require("../../database/entities/product-competitor.entity");
const products_service_1 = require("../products/products.service");
const product_entity_1 = require("../../database/entities/product.entity");
const scraping_service_1 = require("../scraping/scraping.service");
const configuration_entity_1 = require("../../database/entities/configuration.entity");
const pricing_log_entity_1 = require("../../database/entities/pricing-log.entity");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
const sequelize_1 = require("sequelize");
const dom_query_entity_1 = require("../../database/entities/dom_query.entity");
let ProductCompetitorService = class ProductCompetitorService {
    constructor(ConfigurationService, ProductsService, ScrapingService) {
        this.ConfigurationService = ConfigurationService;
        this.ProductsService = ProductsService;
        this.ScrapingService = ScrapingService;
    }
    async create(data) {
        const domain = (0, domain_helper_1.getDomain)(data.competitor_url);
        const product = await this.ProductsService.get(data.product_id);
        const configuration = await this.ConfigurationService.getByDomain(domain);
        if (!configuration)
            throw new common_1.BadRequestException('no configuration exists for this domain');
        const competitorExisting = product.product_competitors.reduce((acc, item) => {
            if (item.configuration_id === configuration.id)
                return true;
            return acc;
        }, false);
        if (competitorExisting) {
            throw new common_1.BadRequestException(`a competitor for the domain :${configuration.domain} is already existing!`);
        }
        const htmlRawData = await this.ScrapingService.scrapeData(data.competitor_url, configuration.jsRendering);
        const newQuery = data.is_grouped
            ? await dom_query_entity_1.DOM_Query.create({
                price_query: data.price_query,
                stock_query: data.stock_query,
                stock_pattern: data.stock_pattern,
                configuration_id: configuration.id,
            })
            : null;
        const price = await this.ScrapingService.getPrice(htmlRawData, data.is_grouped ? newQuery.price_query : configuration.price_dom_query);
        if (!price)
            throw new common_1.InternalServerErrorException('unable to get price of this product');
        const stockStatus = await this.ScrapingService.getStockInfo(htmlRawData, data.is_grouped ? newQuery.stock_query : configuration.stock_dom_query, data.is_grouped ? newQuery.stock_pattern : configuration.stock_pattern);
        const defaultQuery = data.is_grouped
            ? null
            : await dom_query_entity_1.DOM_Query.findOne({
                where: {
                    configuration_id: configuration.id,
                    query_type: dom_query_entity_1.query_type.DEFAULT,
                },
            });
        const competitor = await product_competitor_entity_1.ProductCompetitor.create({
            name: data.name,
            domain,
            competitor_url: data.competitor_url,
            product_id: product.id,
            configuration_id: configuration.id,
            price,
            in_stock: stockStatus,
            dom_query_id: data.is_grouped ? newQuery.id : defaultQuery.id,
        });
        await this.ProductsService.updateMarketPosition(product);
        return competitor;
    }
    async updateInStockStatus(competitorId, inStock) {
        try {
            const competitor = await product_competitor_entity_1.ProductCompetitor.findOne({
                where: { id: competitorId },
            });
            if (!competitor) {
                throw new Error('Competitor not found');
            }
            competitor.in_stock = inStock;
            await competitor.save();
        }
        catch (error) {
            throw new Error('Failed to update in_stock status');
        }
    }
    async get(id) {
        const competitor = await product_competitor_entity_1.ProductCompetitor.findByPk(id, {
            include: [{ model: configuration_entity_1.Configuration }, { model: dom_query_entity_1.DOM_Query }],
        });
        if (!competitor)
            throw new common_1.BadRequestException('unable to find competitor');
        return competitor;
    }
    async list(page, size, sorting_order, productId, configurationId) {
        const product = productId
            ? await this.ProductsService.get(productId)
            : null;
        const config = configurationId
            ? await this.ConfigurationService.get(configurationId)
            : null;
        let queryOptions = {
            where: {},
        };
        if (product)
            queryOptions.where = Object.assign(Object.assign({}, queryOptions.where), { product_id: product.id });
        if (config)
            queryOptions.where = Object.assign(Object.assign({}, queryOptions.where), { configuration_id: config.id });
        const competitorList = await product_competitor_entity_1.ProductCompetitor.findAndCountAll(Object.assign(Object.assign({}, queryOptions), { attributes: [
                'id',
                'domain',
                'name',
                'price',
                'competitor_url',
                'in_stock',
                'created_at',
                'updated_at',
            ], include: [
                {
                    model: pricing_log_entity_1.PricingLog,
                    order: [['found_at', 'DESC']],
                    limit: 1,
                },
                {
                    model: product_entity_1.Product,
                    attributes: ['id', 'name', 'base_price', 'product_url'],
                },
                { model: dom_query_entity_1.DOM_Query, attributes: ['id', 'query_type'] },
            ], limit: size, offset: page * size, order: [sorting_order] }));
        return {
            data: competitorList.rows,
            totalPages: Math.ceil(competitorList.count / Number(size)),
        };
    }
    async update(id, data) {
        const competitor = await this.get(id);
        if (data.name)
            competitor.set({ name: data.name });
        if (data.competitor_url) {
            const domain = (0, domain_helper_1.getDomain)(data.competitor_url);
            const configuration = await this.ConfigurationService.getByDomain(domain);
            const htmlRawData = await this.ScrapingService.scrapeData(data.competitor_url, configuration.jsRendering);
            const price = await this.ScrapingService.getPrice(htmlRawData, competitor.dom_query.price_query);
            const stockInfo = await this.ScrapingService.getStockInfo(htmlRawData, competitor.dom_query.stock_query, competitor.dom_query.stock_pattern);
            if (!price)
                throw new common_1.InternalServerErrorException('unable to get price from this url');
            competitor.set({
                price,
                configuration_id: configuration.id,
                domain,
                competitor_url: data.competitor_url,
                in_stock: stockInfo,
            });
        }
        if (data.product_id) {
            const product = await this.ProductsService.get(data.product_id);
            competitor.set({ product_id: product.id });
        }
        await competitor.save();
        return competitor;
    }
    async completeListForScraping(page) {
        const size = 10;
        const list = await product_competitor_entity_1.ProductCompetitor.findAndCountAll({
            include: [
                { model: configuration_entity_1.Configuration, where: { is_active: true } },
                { model: dom_query_entity_1.DOM_Query },
                {
                    model: product_entity_1.Product,
                    attributes: ['base_price'],
                    where: {},
                },
            ],
            limit: size,
            offset: page * size,
        });
        return {
            data: list.rows,
            totalCount: list.count,
            totalPages: Math.ceil(list.count / Number(size)),
        };
    }
    async remove(id) {
        const competitor = await this.get(id);
        const defaultConfigurationQuery = await dom_query_entity_1.DOM_Query.findOne({
            where: {
                configuration_id: competitor.configuration_id,
                query_type: dom_query_entity_1.query_type.DEFAULT,
            },
        });
        if (defaultConfigurationQuery.id !== competitor.dom_query_id) {
            const query = await dom_query_entity_1.DOM_Query.findByPk(competitor.dom_query_id);
            await query.destroy();
        }
        const product = await this.ProductsService.get(competitor.product_id);
        await competitor.destroy({
            force: true,
        });
        await this.ProductsService.updateMarketPosition(product);
    }
    getSortingParams(priceOrder, createdAtOrder, updatedAtOrder) {
        if (priceOrder)
            return [sequelize_1.Sequelize.literal('price'), priceOrder];
        if (createdAtOrder)
            return [sequelize_1.Sequelize.literal('created_at'), createdAtOrder];
        if (updatedAtOrder)
            return [sequelize_1.Sequelize.literal('updated_at'), updatedAtOrder];
        return [sequelize_1.Sequelize.literal('created_at'), query_params_pipe_1.sorting_order.DESC];
    }
};
ProductCompetitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService,
        products_service_1.ProductsService,
        scraping_service_1.ScrapingService])
], ProductCompetitorService);
exports.ProductCompetitorService = ProductCompetitorService;
//# sourceMappingURL=product-competitor.service.js.map