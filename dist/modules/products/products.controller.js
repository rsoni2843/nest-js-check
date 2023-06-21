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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
const product_body_1 = require("./dto/product.body");
const products_service_1 = require("./products.service");
const product_entity_1 = require("../../database/entities/product.entity");
const product_competitor_entity_1 = require("../../database/entities/product-competitor.entity");
const configuration_entity_1 = require("../../database/entities/configuration.entity");
let ProductsController = class ProductsController {
    constructor(ProductsService) {
        this.ProductsService = ProductsService;
    }
    async create(data) {
        return await this.ProductsService.create(data);
    }
    async list(page, size, category_id, brand_id, configuration_id, price, product_code, name, competitor_count, created_at, q_market_position, q_product_code_or_name, q_product_code, q_product_name, q_price, q_price_comparison, q_in_stock, failed_products) {
        const sortingParams = this.ProductsService.getSortingParams(price, product_code, name, competitor_count, created_at, q_market_position);
        const searchParams = this.ProductsService.getSearchParams(q_product_code_or_name, q_product_code, q_product_name, q_price, q_price_comparison, q_market_position, q_in_stock ? q_in_stock == 'true' : undefined);
        return await this.ProductsService.list(page, size, sortingParams, searchParams, category_id, brand_id, configuration_id, failed_products ? true : false);
    }
    async insightList(page, size, variation_type, start, end, categories, brands, configurations, price, product_code, name, competitor_count, created_at, q_market_position, q_product_code_or_name, q_product_code, q_product_name, q_price, q_price_comparison, q_in_stock, q_competitor_in_stock, failed_products) {
        const sortingParams = this.ProductsService.getSortingParams(price, product_code, name, competitor_count, created_at, q_market_position);
        const searchParams = this.ProductsService.getSearchParams(q_product_code_or_name, q_product_code, q_product_name, q_price, q_price_comparison, q_market_position, q_in_stock ? q_in_stock == 'true' : undefined);
        let productIds = variation_type
            ? await this.ProductsService.getProductIdsFromPriceVariation(start, end, variation_type)
            : undefined;
        if (q_competitor_in_stock !== undefined) {
            const outOfStockCompetitors = await product_competitor_entity_1.ProductCompetitor.findAll({
                attributes: ['product_id'],
                where: {
                    in_stock: q_competitor_in_stock == 'true' ? true : false,
                },
                include: [
                    {
                        model: configuration_entity_1.Configuration,
                        attributes: ['id'],
                        where: { is_active: true },
                    },
                ],
            });
            if (!productIds)
                productIds = [];
            productIds = [
                ...productIds,
                ...outOfStockCompetitors.map((c) => c.product_id),
            ];
        }
        return await this.ProductsService.insights(page, size, searchParams, sortingParams, categories, brands, configurations, productIds, failed_products, false);
    }
    async download(res, page, size, variation_type, start, end, categories, brands, configurations, price, product_code, name, competitor_count, created_at, q_market_position, q_product_code_or_name, q_product_code, q_product_name, q_price, q_price_comparison, q_in_stock, failed_products) {
        const sortingParams = this.ProductsService.getSortingParams(price, product_code, name, competitor_count, created_at, q_market_position);
        const searchParams = this.ProductsService.getSearchParams(q_product_code_or_name, q_product_code, q_product_name, q_price, q_price_comparison, q_market_position, q_in_stock ? q_in_stock == 'true' : undefined);
        const productIds = variation_type && start && end
            ? await this.ProductsService.getProductIdsFromPriceVariation(start, end, variation_type)
            : undefined;
        const data = await this.ProductsService.insights(page, size, searchParams, sortingParams, categories, brands, configurations, productIds, failed_products, true);
        await this.ProductsService.download(data, {
            searchOptions: Object.assign({}, searchParams),
            sortingParams: Object.assign({}, sortingParams),
            categories,
            brands,
            configurations,
            include_failed_products: failed_products,
            variation_type,
            in_stock: q_in_stock,
            price: q_price,
            price_comparison: q_price_comparison,
            name: q_product_name,
            code: q_product_code,
            product_code_or_name: q_product_code_or_name,
        }, res);
    }
    async get(id) {
        return await this.ProductsService.get(id);
    }
    async addCategory(productId, categoryId) {
        await this.ProductsService.addCategory(productId, categoryId);
        return {
            message: 'Added product to the category',
        };
    }
    async removeCategory(productId, categoryId) {
        await this.ProductsService.removeCategory(productId, categoryId);
        return {
            message: 'Removed product from category',
        };
    }
    async update(id, data) {
        return await this.ProductsService.update(id, data);
    }
    async remove(id) {
        await this.ProductsService.remove(id);
        return {
            message: 'Deleted Successfully',
        };
    }
    async getProductInfo(url_key) {
        return await this.ProductsService.fetchProductInfo(url_key);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_body_1.ProductCreateArgs]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __param(2, (0, common_1.Query)('category_id')),
    __param(3, (0, common_1.Query)('brand_id')),
    __param(4, (0, common_1.Query)('configuration_id')),
    __param(5, (0, common_1.Query)('price', new query_params_pipe_1.ParseSortingPipe())),
    __param(6, (0, common_1.Query)('product_code', new query_params_pipe_1.ParseSortingPipe())),
    __param(7, (0, common_1.Query)('name', new query_params_pipe_1.ParseSortingPipe())),
    __param(8, (0, common_1.Query)('competitor_count', new query_params_pipe_1.ParseSortingPipe())),
    __param(9, (0, common_1.Query)('created_at', new query_params_pipe_1.ParseSortingPipe())),
    __param(10, (0, common_1.Query)('q_market_position', new query_params_pipe_1.ParseEnumPipe(Object.values(product_entity_1.marketPositionType)))),
    __param(11, (0, common_1.Query)('q_product_code_or_name')),
    __param(12, (0, common_1.Query)('q_product_code')),
    __param(13, (0, common_1.Query)('q_product_name')),
    __param(14, (0, common_1.Query)('q_price')),
    __param(15, (0, common_1.Query)('q_price_comparison', new query_params_pipe_1.ParseEnumPipe(['gt', 'gte', 'lt', 'lte', 'eq']))),
    __param(16, (0, common_1.Query)('q_in_stock', new query_params_pipe_1.ParseEnumPipe(['true', 'false']))),
    __param(17, (0, common_1.Query)('failed_products')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, Number, String, String, String, String, String, String, String, String, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('insight-list'),
    __param(0, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __param(2, (0, common_1.Query)('variation_type', new query_params_pipe_1.ParseEnumPipe(Object.values(products_service_1.price_variation_enum)))),
    __param(3, (0, common_1.Query)('startDate', new query_params_pipe_1.DateFormatConversionPipe('startDate'))),
    __param(4, (0, common_1.Query)('endDate', new query_params_pipe_1.DateFormatConversionPipe('endDate'))),
    __param(5, (0, common_1.Query)('categories', query_params_pipe_1.ParseArrayPipe)),
    __param(6, (0, common_1.Query)('brands', query_params_pipe_1.ParseArrayPipe)),
    __param(7, (0, common_1.Query)('configurations', query_params_pipe_1.ParseArrayPipe)),
    __param(8, (0, common_1.Query)('price', new query_params_pipe_1.ParseSortingPipe())),
    __param(9, (0, common_1.Query)('product_code', new query_params_pipe_1.ParseSortingPipe())),
    __param(10, (0, common_1.Query)('name', new query_params_pipe_1.ParseSortingPipe())),
    __param(11, (0, common_1.Query)('competitor_count', new query_params_pipe_1.ParseSortingPipe())),
    __param(12, (0, common_1.Query)('created_at', new query_params_pipe_1.ParseSortingPipe())),
    __param(13, (0, common_1.Query)('q_market_position', new query_params_pipe_1.ParseEnumPipe(Object.values(product_entity_1.marketPositionType)))),
    __param(14, (0, common_1.Query)('q_product_code_or_name')),
    __param(15, (0, common_1.Query)('q_product_code')),
    __param(16, (0, common_1.Query)('q_product_name')),
    __param(17, (0, common_1.Query)('q_price')),
    __param(18, (0, common_1.Query)('q_price_comparison', new query_params_pipe_1.ParseEnumPipe(['gt', 'gte', 'lt', 'lte', 'eq']))),
    __param(19, (0, common_1.Query)('q_in_stock', new query_params_pipe_1.ParseEnumPipe(['true', 'false']))),
    __param(20, (0, common_1.Query)('q_competitor_in_stock', new query_params_pipe_1.ParseEnumPipe(['true', 'false']))),
    __param(21, (0, common_1.Query)('failed_products')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Date,
        Date, Array, Array, Array, String, String, String, String, String, String, String, String, String, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "insightList", null);
__decorate([
    (0, common_1.Get)('download-report'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(2, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __param(3, (0, common_1.Query)('variation_type', new query_params_pipe_1.ParseEnumPipe(Object.values(products_service_1.price_variation_enum)))),
    __param(4, (0, common_1.Query)('startDate', new query_params_pipe_1.DateFormatConversionPipe('startDate'))),
    __param(5, (0, common_1.Query)('endDate', new query_params_pipe_1.DateFormatConversionPipe('endDate'))),
    __param(6, (0, common_1.Query)('categories', query_params_pipe_1.ParseArrayPipe)),
    __param(7, (0, common_1.Query)('brands', query_params_pipe_1.ParseArrayPipe)),
    __param(8, (0, common_1.Query)('configurations', query_params_pipe_1.ParseArrayPipe)),
    __param(9, (0, common_1.Query)('price', new query_params_pipe_1.ParseSortingPipe())),
    __param(10, (0, common_1.Query)('product_code', new query_params_pipe_1.ParseSortingPipe())),
    __param(11, (0, common_1.Query)('name', new query_params_pipe_1.ParseSortingPipe())),
    __param(12, (0, common_1.Query)('competitor_count', new query_params_pipe_1.ParseSortingPipe())),
    __param(13, (0, common_1.Query)('created_at', new query_params_pipe_1.ParseSortingPipe())),
    __param(14, (0, common_1.Query)('q_market_position', new query_params_pipe_1.ParseEnumPipe(Object.values(product_entity_1.marketPositionType)))),
    __param(15, (0, common_1.Query)('q_product_code_or_name')),
    __param(16, (0, common_1.Query)('q_product_code')),
    __param(17, (0, common_1.Query)('q_product_name')),
    __param(18, (0, common_1.Query)('q_price')),
    __param(19, (0, common_1.Query)('q_price_comparison', new query_params_pipe_1.ParseEnumPipe(['gt', 'gte', 'lt', 'lte', 'eq']))),
    __param(20, (0, common_1.Query)('q_in_stock', new query_params_pipe_1.ParseEnumPipe(['true', 'false']))),
    __param(21, (0, common_1.Query)('failed_products')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, Date,
        Date, Array, Array, Array, String, String, String, String, String, String, String, String, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "download", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':productId/category/:categoryId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Delete)(':productId/category/:categoryId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, product_body_1.ProductUpdateArgs]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('product-info'),
    __param(0, (0, common_1.Query)('url_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductInfo", null);
ProductsController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map