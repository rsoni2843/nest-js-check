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
exports.PricingLogController = void 0;
const common_1 = require("@nestjs/common");
const pricing_log_service_1 = require("./pricing-log.service");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
let PricingLogController = class PricingLogController {
    constructor(PricingLogService) {
        this.PricingLogService = PricingLogService;
    }
    async getProductLogs(productId, page, size) {
        return await this.PricingLogService.getProductLogs(page, size, productId);
    }
    async getCompetitorLogs(productCompetitorId, page, size) {
        return await this.PricingLogService.getCompetitorLogs(page, size, productCompetitorId);
    }
    async getProductSummary(productId, page, size) {
        return await this.PricingLogService.getConfigurationWiseLogs(page, size, productId);
    }
};
__decorate([
    (0, common_1.Get)('product/:product_id'),
    __param(0, (0, common_1.Param)('product_id', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(2, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PricingLogController.prototype, "getProductLogs", null);
__decorate([
    (0, common_1.Get)('competitor/:product_competitor_id'),
    __param(0, (0, common_1.Param)('product_competitor_id', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(2, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PricingLogController.prototype, "getCompetitorLogs", null);
__decorate([
    (0, common_1.Get)('product-summary/:product_id'),
    __param(0, (0, common_1.Param)('product_id', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(2, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PricingLogController.prototype, "getProductSummary", null);
PricingLogController = __decorate([
    (0, common_1.Controller)('pricing-log'),
    __metadata("design:paramtypes", [pricing_log_service_1.PricingLogService])
], PricingLogController);
exports.PricingLogController = PricingLogController;
//# sourceMappingURL=pricing-log.controller.js.map