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
exports.ScraperController = void 0;
const common_1 = require("@nestjs/common");
const scraping_service_1 = require("./scraping.service");
let ScraperController = class ScraperController {
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async scrapeData(url, render) {
        return this.scraperService.scrapeData(url, render);
    }
    async scrapeStockInfo(url, stock_dom_query, stock_pattern, render) {
        const htmlRawData = await this.scraperService.scrapeData(url, render);
        return this.scraperService.getStockInfo(htmlRawData, stock_dom_query, stock_pattern);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Query)('render')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeData", null);
__decorate([
    (0, common_1.Get)('get-stock-info'),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Query)('stock_dom_query')),
    __param(2, (0, common_1.Query)('stock_pattern')),
    __param(3, (0, common_1.Query)('render')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeStockInfo", null);
ScraperController = __decorate([
    (0, common_1.Controller)('scraper'),
    __metadata("design:paramtypes", [scraping_service_1.ScrapingService])
], ScraperController);
exports.ScraperController = ScraperController;
//# sourceMappingURL=scraping.controller.js.map