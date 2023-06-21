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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
let StatsController = class StatsController {
    constructor(StatsService) {
        this.StatsService = StatsService;
    }
    async getTrackingSummary() {
        return await this.StatsService.getTrackingSummary();
    }
    async getMarketPostionStats() {
        return await this.StatsService.getMarketStats();
    }
    async getDentalkartIndex() {
        return await this.StatsService.getCurrentIndex();
    }
    async getCompetitorIndex(range, startDate, endDate) {
        return await this.StatsService.getCompetitorIndex(range, startDate, endDate);
    }
    async dentalkartHistoricalIndex(range, startDate, endDate) {
        return await this.StatsService.getDentalkartHistoricalIndex(range, startDate, endDate);
    }
    async competitorHistoricalIndex(range, startDate, endDate) {
        return await this.StatsService.getCompetitorHistoricalIndex(range, startDate, endDate);
    }
    async priceVariation(start, end) {
        return await this.StatsService.getPriceVariation(start, end);
    }
    async outOfStock() {
        return await this.StatsService.getOutOfStockInfo();
    }
};
__decorate([
    (0, common_1.Get)('tracking-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getTrackingSummary", null);
__decorate([
    (0, common_1.Get)('marketposition'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getMarketPostionStats", null);
__decorate([
    (0, common_1.Get)('dentalkart-index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getDentalkartIndex", null);
__decorate([
    (0, common_1.Get)('competitor-index'),
    __param(0, (0, common_1.Query)('range')),
    __param(1, (0, common_1.Query)('startDate', new query_params_pipe_1.DateFormatConversionPipe('startDate'))),
    __param(2, (0, common_1.Query)('endDate', new query_params_pipe_1.DateFormatConversionPipe('endDate'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getCompetitorIndex", null);
__decorate([
    (0, common_1.Get)('dentalkart-historical-index'),
    __param(0, (0, common_1.Query)('range')),
    __param(1, (0, common_1.Query)('startDate', new query_params_pipe_1.DateFormatConversionPipe('startDate'))),
    __param(2, (0, common_1.Query)('endDate', new query_params_pipe_1.DateFormatConversionPipe('endDate'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "dentalkartHistoricalIndex", null);
__decorate([
    (0, common_1.Get)('competitor-historical-index'),
    __param(0, (0, common_1.Query)('range')),
    __param(1, (0, common_1.Query)('startDate', new query_params_pipe_1.DateFormatConversionPipe('startDate'))),
    __param(2, (0, common_1.Query)('endDate', new query_params_pipe_1.DateFormatConversionPipe('endDate'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "competitorHistoricalIndex", null);
__decorate([
    (0, common_1.Get)('price-variation'),
    __param(0, (0, common_1.Query)('startDate', new query_params_pipe_1.DateFormatConversionPipe('startDate'))),
    __param(1, (0, common_1.Query)('endDate', new query_params_pipe_1.DateFormatConversionPipe('endDate'))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "priceVariation", null);
__decorate([
    (0, common_1.Get)('out-of-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "outOfStock", null);
StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
exports.StatsController = StatsController;
//# sourceMappingURL=stats.controller.js.map