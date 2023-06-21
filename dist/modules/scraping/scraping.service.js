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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapingService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const env_1 = __importDefault(require("../../config/env"));
const jsdom_1 = require("jsdom");
const service_logger_1 = require("../../utils/service-logger");
let ScrapingService = class ScrapingService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getPrice(htmlRawData, dom_query) {
        const price = this.executeQuery(htmlRawData, dom_query);
        return price;
    }
    async getStockInfo(htmlRawData, stockDomQuery, stockPattern) {
        const isInStock = this.isElementPresent(htmlRawData, stockDomQuery);
        if (!isInStock) {
            return false;
        }
        if (isInStock && stockPattern === null) {
            return true;
        }
        const stockContent = this.getElementContent(htmlRawData, stockDomQuery);
        const stockStatus = this.extractPattern(stockContent);
        if (stockStatus === null) {
            return false;
        }
        if (typeof stockStatus === 'string' && stockStatus.trim() === stockPattern)
            return true;
    }
    extractPattern(html) {
        if (!html)
            return null;
        const hasHtmlTags = /<[a-z][\s\S]*>/i.test(html);
        if (hasHtmlTags) {
            const regex = /(?:<\/\w+>)([^<]+)/;
            const matches = html.match(regex);
            if (matches && matches.length > 1) {
                const extractedString = matches[1].trim();
                return extractedString;
            }
            else {
                return null;
            }
        }
        else {
            return html;
        }
    }
    isElementPresent(htmlData, domQuery) {
        if (!htmlData)
            return false;
        const dom = new jsdom_1.JSDOM(htmlData);
        const document = dom.window.document;
        const element = document.querySelector(domQuery);
        return !!element;
    }
    getElementContent(htmlData, domQuery) {
        if (!htmlData)
            return null;
        const dom = new jsdom_1.JSDOM(htmlData);
        const document = dom.window.document;
        const element = document.querySelector(domQuery);
        if (!element)
            return null;
        return element.innerHTML;
    }
    async scrapeData(url, render) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://api.scraperapi.com`, {
            params: {
                api_key: env_1.default.scraper_api_key,
                url: url,
                render: render,
            },
        }));
        if ([200, 201].indexOf(response.status) === -1) {
            return null;
        }
        const data = response.data;
        return data;
    }
    async getHTML(targetURL, jsRendering) {
        try {
            const url = `http://api.scraperapi.com?api_key=${env_1.default.scraper_api_key}&url=${targetURL}&render=${jsRendering}`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            return [200, 201].indexOf(response.status) === -1 ? null : response === null || response === void 0 ? void 0 : response.data;
        }
        catch (error) {
            service_logger_1.logger.error('Error in get call', error);
            return null;
        }
    }
    executeQuery(htmlData, dom_query) {
        const dom = new jsdom_1.JSDOM(htmlData);
        const document = dom.window.document;
        const element = document.querySelector(dom_query);
        if (!element)
            return null;
        const price = this.extractPrice(element.innerHTML);
        return price;
    }
    extractPrice(html) {
        if (!html)
            return null;
        const regex = /[\d,]+(?:\.\d+)?/;
        const matches = html.match(regex);
        if (matches) {
            const priceString = matches[0].replace(',', '');
            const price = parseFloat(priceString);
            if (!isNaN(price)) {
                return price;
            }
        }
        return null;
    }
};
ScrapingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ScrapingService);
exports.ScrapingService = ScrapingService;
//# sourceMappingURL=scraping.service.js.map