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
exports.ProductCompetitorController = void 0;
const common_1 = require("@nestjs/common");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
const product_competitor_body_1 = require("./dto/product-competitor.body");
const product_competitor_service_1 = require("./product-competitor.service");
let ProductCompetitorController = class ProductCompetitorController {
    constructor(ProductCompetitorService) {
        this.ProductCompetitorService = ProductCompetitorService;
    }
    async test() {
        const list = await this.ProductCompetitorService.completeListForScraping(0);
        return list;
    }
    async create(data) {
        const competitor = await this.ProductCompetitorService.create(data);
        return competitor;
    }
    async list(page, size, price, created_at, updated_at, product_id, configuration_id) {
        const sortingParams = this.ProductCompetitorService.getSortingParams(price, created_at, updated_at);
        return await this.ProductCompetitorService.list(page, size, sortingParams, product_id, configuration_id);
    }
    async get(id) {
        return await this.ProductCompetitorService.get(id);
    }
    async update(id, data) {
        return await this.ProductCompetitorService.update(id, data);
    }
    async remove(id) {
        await this.ProductCompetitorService.remove(id);
        return {
            message: 'Deleted Successfully',
        };
    }
};
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductCompetitorController.prototype, "test", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_competitor_body_1.ProductCompetitorCreateArgs]),
    __metadata("design:returntype", Promise)
], ProductCompetitorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __param(2, (0, common_1.Query)('price', new query_params_pipe_1.ParseSortingPipe())),
    __param(3, (0, common_1.Query)('created_at', new query_params_pipe_1.ParseSortingPipe())),
    __param(4, (0, common_1.Query)('updated_at', new query_params_pipe_1.ParseSortingPipe())),
    __param(5, (0, common_1.Query)('product_id')),
    __param(6, (0, common_1.Query)('configuration_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductCompetitorController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductCompetitorController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, product_competitor_body_1.ProductCompetitorUpdateArgs]),
    __metadata("design:returntype", Promise)
], ProductCompetitorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductCompetitorController.prototype, "remove", null);
ProductCompetitorController = __decorate([
    (0, common_1.Controller)('competitor'),
    __metadata("design:paramtypes", [product_competitor_service_1.ProductCompetitorService])
], ProductCompetitorController);
exports.ProductCompetitorController = ProductCompetitorController;
//# sourceMappingURL=product-competitor.controller.js.map