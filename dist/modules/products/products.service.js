"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = exports.price_variation_enum = void 0;
const common_1 = require("@nestjs/common");
const product_entity_1 = require("../../database/entities/product.entity");
const produuct_category_service_1 = require("../product-category/produuct-category.service");
const category_entity_1 = require("../../database/entities/category.entity");
const category_service_1 = require("../category/category.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const env_1 = __importDefault(require("../../config/env"));
const product_competitor_entity_1 = require("../../database/entities/product-competitor.entity");
const sequelize_1 = require("sequelize");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
const brand_service_1 = require("../brand/brand.service");
const brand_entity_1 = require("../../database/entities/brand.entity");
const stats_service_1 = require("../stats/stats.service");
const pricing_log_entity_1 = require("../../database/entities/pricing-log.entity");
const configuration_entity_1 = require("../../database/entities/configuration.entity");
const fs = __importStar(require("fs"));
const s3_service_1 = require("../../utils/s3-service");
const report_files_entity_1 = require("../../database/entities/report-files.entity");
const configuration_service_1 = require("../configuration/configuration.service");
const date_helper_1 = require("../../utils/date-helper");
const dom_query_entity_1 = require("../../database/entities/dom_query.entity");
var price_variation_enum;
(function (price_variation_enum) {
    price_variation_enum["INCREASE"] = "increase";
    price_variation_enum["DECREASE"] = "decrease";
})(price_variation_enum = exports.price_variation_enum || (exports.price_variation_enum = {}));
let ProductsService = class ProductsService {
    constructor(ProductCategoryService, CategoryService, httpService, BrandService, StatsService, ConfigurationService, S3Service) {
        this.ProductCategoryService = ProductCategoryService;
        this.CategoryService = CategoryService;
        this.httpService = httpService;
        this.BrandService = BrandService;
        this.StatsService = StatsService;
        this.ConfigurationService = ConfigurationService;
        this.S3Service = S3Service;
    }
    async create(data) {
        const productInfo = await this.fetchProductInfo(data.product_url);
        if (!productInfo) {
            throw new common_1.BadRequestException('unable to load product details from the product url');
        }
        const { category_id } = data, createBody = __rest(data, ["category_id"]);
        const productWithExactProductCode = await product_entity_1.Product.findOne({
            where: { product_code: productInfo.product_code },
        });
        if (productWithExactProductCode) {
            throw new common_1.ConflictException('product with the same product code already exist');
        }
        const brand = await this.BrandService.get(data.brand_id);
        const createdProduct = await product_entity_1.Product.create(Object.assign(Object.assign({}, createBody), { base_price: productInfo.price, in_stock: productInfo.is_in_stock, name: data.name ? data.name : productInfo.name, product_code: data.product_code, brand_id: brand.id }));
        if (category_id)
            await this.addCategory(createdProduct.id, category_id);
        return createdProduct;
    }
    async update(id, data) {
        const product = await this.get(id);
        if (data.base_price != product.base_price) {
            await this.updateMarketPosition(product);
        }
        product.set(Object.assign({}, data));
        if (data.category_id) {
            const existingCategory = await this.CategoryService.get(data.category_id);
            await this.ProductCategoryService.update(product.id, existingCategory.id);
        }
        await product.save();
        return product;
    }
    async get(id, includeCompetitors) {
        const product = await product_entity_1.Product.findByPk(id, {
            include: [
                {
                    model: category_entity_1.Category,
                    attributes: ['id', 'title', 'description'],
                    through: { attributes: [] },
                },
                { model: product_competitor_entity_1.ProductCompetitor },
            ],
        });
        if (!product)
            throw new common_1.BadRequestException('unable to get product');
        return product;
    }
    async list(page, size, sorting_order, searchParams, category_id, brand_id, configuration_id, includeProductswithFailedScraping) {
        const categoryOptions = category_id ? { where: { id: category_id } } : {};
        const brandOptions = brand_id ? { where: { id: brand_id } } : {};
        const configurationOptions = configuration_id
            ? { where: { configuration_id: configuration_id } }
            : {};
        let failedOptions = {};
        if (includeProductswithFailedScraping) {
            const products = await product_entity_1.Product.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: product_competitor_entity_1.ProductCompetitor,
                        include: [
                            {
                                model: pricing_log_entity_1.PricingLog,
                                order: [['found_at', 'DESC']],
                                limit: 1,
                            },
                            {
                                model: configuration_entity_1.Configuration,
                                attributes: ['id', 'domain'],
                                where: { is_active: true },
                            },
                        ],
                    },
                ],
            });
            failedOptions = {
                id: {
                    [sequelize_1.Op.in]: products.reduce((productIds, product) => {
                        var _a;
                        let id = null;
                        for (let comp of product.product_competitors) {
                            if (((_a = comp.pricing_logs[0]) === null || _a === void 0 ? void 0 : _a.status) == 'failure') {
                                productIds.push(product.id);
                                break;
                            }
                        }
                        return productIds;
                    }, []),
                },
            };
        }
        const productList = await product_entity_1.Product.findAndCountAll({
            where: Object.assign(Object.assign({}, searchParams), failedOptions),
            attributes: [
                ...Object.keys(product_entity_1.Product.getAttributes()),
                [
                    sequelize_1.Sequelize.literal(`(SELECT COUNT(*) FROM product_competitor WHERE product_competitor.product_id = Product.id) `),
                    'competitor_count',
                ],
            ],
            include: [
                Object.assign({ model: product_competitor_entity_1.ProductCompetitor, attributes: [] }, configurationOptions),
                Object.assign({ model: category_entity_1.Category, attributes: ['id', 'title', 'description'], through: { attributes: [] } }, categoryOptions),
                Object.assign({ model: brand_entity_1.Brand, attributes: ['id', 'name'] }, brandOptions),
            ],
            distinct: true,
            order: [sorting_order],
            limit: size,
            offset: page * size,
        });
        const totalCount = productList.count;
        return {
            data: productList.rows,
            totalCount: totalCount,
            totalPages: Math.ceil(productList.count / Number(size)),
        };
    }
    async insights(page, size, searchParams, sorting_order, categories, brands, configurations, products, includeProductswithFailedScraping, getCompleteList) {
        const categoryOptions = categories
            ? {
                where: {
                    id: {
                        [sequelize_1.Op.in]: categories,
                    },
                },
            }
            : {};
        const brandOptions = brands
            ? {
                where: {
                    id: {
                        [sequelize_1.Op.in]: brands,
                    },
                },
            }
            : {};
        const configurationOptions = configurations
            ? {
                where: {
                    configuration_id: {
                        [sequelize_1.Op.in]: configurations,
                    },
                },
            }
            : {};
        let productOptions = products
            ? {
                id: {
                    [sequelize_1.Op.in]: products,
                },
            }
            : {};
        if (includeProductswithFailedScraping) {
            const products = await product_entity_1.Product.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: product_competitor_entity_1.ProductCompetitor,
                        include: [
                            {
                                model: pricing_log_entity_1.PricingLog,
                                order: [['found_at', 'DESC']],
                                limit: 1,
                            },
                        ],
                    },
                ],
            });
            productOptions = {
                id: {
                    [sequelize_1.Op.in]: [
                        ...products,
                        ...products.reduce((productIds, product) => {
                            var _a;
                            for (let comp of product.product_competitors) {
                                if (((_a = comp.pricing_logs[0]) === null || _a === void 0 ? void 0 : _a.status) == 'failure') {
                                    productIds.push(product.id);
                                    break;
                                }
                            }
                            return productIds;
                        }, []),
                    ],
                },
            };
        }
        const pricingLogOptions = {};
        const productCompetitorIncludeOptions = [
            Object.assign(Object.assign({ model: pricing_log_entity_1.PricingLog, order: [['found_at', 'DESC']] }, pricingLogOptions), { limit: 1 }),
            {
                model: configuration_entity_1.Configuration,
                attributes: ['id', 'domain'],
                where: { is_active: true },
            },
            { model: dom_query_entity_1.DOM_Query, attributes: ['id', 'query_type'] },
        ];
        if (getCompleteList) {
            productCompetitorIncludeOptions.push({
                model: configuration_entity_1.Configuration,
                where: {
                    is_active: true,
                },
            });
        }
        const options = {
            subQuery: false,
            where: Object.assign(Object.assign({}, searchParams), productOptions),
            attributes: [...Object.keys(product_entity_1.Product.getAttributes())],
            include: [
                Object.assign({ model: product_competitor_entity_1.ProductCompetitor, include: [...productCompetitorIncludeOptions] }, configurationOptions),
                Object.assign({ model: category_entity_1.Category, attributes: ['id', 'title', 'description'], through: { attributes: [] } }, categoryOptions),
                Object.assign({ model: brand_entity_1.Brand, attributes: ['id', 'name'] }, brandOptions),
            ],
            order: [sorting_order],
        };
        if (!getCompleteList) {
            options.limit = size;
            options.offset = page * size;
        }
        let list = null;
        let paginatedList = null;
        if (getCompleteList)
            list = await product_entity_1.Product.findAll(Object.assign({}, options));
        else
            paginatedList = await product_entity_1.Product.findAndCountAll(Object.assign(Object.assign({}, options), { group: ['id'], limit: size, offset: page * size }));
        if (getCompleteList)
            return list;
        return {
            data: paginatedList.rows,
            totalCount: paginatedList.count.length,
            totalPages: Math.ceil(paginatedList.count.length / Number(size)),
        };
    }
    async download(data, filterOptions, res) {
        var _a, _b, _c;
        const directoryPath = './reports';
        const filename = `report_${Date.now()}.csv`;
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        const filepath = `${directoryPath}/${filename}`;
        const writeStream = fs.createWriteStream(filepath);
        const headers = [
            'Product Name',
            'Product Code',
            'Brand',
            'Category',
            'My Position',
            'My Index',
            'Minimum Price',
            'Maximum Price',
            'Average Price',
            'My Price',
            'Cheapest Site',
            'Highest Site',
            'Our Stock',
        ];
        const configurations = await configuration_entity_1.Configuration.findAll();
        for (let config of configurations) {
            headers.push(`${config.domain}-Stock`);
            headers.push(`${config.domain}-Price`);
            headers.push(`${config.domain}-URL`);
            headers.push(`${config.domain}-Last time scraped`);
            headers.push(`${config.domain}-scraping status`);
        }
        writeStream.write('Filter Options\n');
        writeStream.write(`sorting:${filterOptions.sortingParams['1']},${filterOptions.sortingParams['0'].val}\n`);
        if (((_a = filterOptions.brands) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            writeStream.write(`brands,${await this.BrandService.getBrandsFromIdArray(filterOptions.brands)}\n`);
        }
        if (((_b = filterOptions.categories) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            writeStream.write(`categories,${await this.CategoryService.getCategoriesFromIdArray(filterOptions.categories)}\n`);
        }
        if (((_c = filterOptions.configurations) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            writeStream.write(`competitors,${await this.ConfigurationService.getConfigurationsFromIdArray(filterOptions.configurations)}\n`);
        }
        if (filterOptions.variation_type) {
            writeStream.write(`price variation,${filterOptions.variation_type}\n`);
        }
        if (filterOptions.in_stock) {
            writeStream.write(`In Stock,${filterOptions.in_stock}\n`);
        }
        if (filterOptions.price) {
            writeStream.write(`Price,${filterOptions.price_comparison},${filterOptions.price}\n`);
        }
        if (filterOptions.name) {
            writeStream.write(`Product Name,${filterOptions.name}\n`);
        }
        if (filterOptions.code) {
            writeStream.write(`Product Code,${filterOptions.code}\n`);
        }
        if (filterOptions.product_code_or_name) {
            writeStream.write(`Product Code or Name,${filterOptions.product_code_or_name}\n`);
        }
        if (filterOptions.include_failed_products) {
            writeStream.write(`404 URL Page , Yes\n`);
        }
        writeStream.write(`\n\n${headers.join(',')}\n`);
        for (let item of data) {
            const itemd = item.product_competitors.reduce((acc, comp) => {
                var _a;
                if (!acc[comp.domain]) {
                    acc[comp.domain] = {
                        stock: comp.in_stock,
                        price: comp.price,
                        url: comp.competitor_url,
                        scrapingStatus: ((_a = comp.pricing_logs[0]) === null || _a === void 0 ? void 0 : _a.status) || '-',
                        scrapingTime: comp.pricing_logs[0]
                            ? new Date(comp.pricing_logs[0].found_at)
                                .toLocaleString()
                                .split(',')
                                .join(' ')
                            : '-',
                    };
                }
                acc.index = comp.pricing_logs.reduce((index, log) => {
                    return index + Math.pow(log.index, -1);
                }, 0);
                return acc;
            }, { index: 0 });
            const addittionalColumns = [];
            for (let config of configurations) {
                if (itemd[config.domain]) {
                    addittionalColumns.push(itemd[config.domain].stock ? 'In Stock' : 'Out of Stock');
                    addittionalColumns.push(itemd[config.domain].price);
                    addittionalColumns.push(itemd[config.domain].url);
                    addittionalColumns.push(itemd[config.domain].scrapingTime);
                    addittionalColumns.push(itemd[config.domain].scrapingStatus);
                }
                else {
                    addittionalColumns.push(...['-', '-', '-', '-', '-']);
                }
            }
            const itemIndex = item.product_competitors.length
                ? (itemd.index * 100) / item.product_competitors.length
                : 0;
            const { maxPrice, minPrice, total, minSite, maxSite } = item.product_competitors.reduce((acc, comp) => {
                if (acc.maxPrice < comp.price) {
                    acc.maxPrice = comp.price;
                    acc.maxSite = comp.domain;
                }
                if (acc.minPrice > comp.price) {
                    acc.minPrice = comp.price;
                    acc.minSite = comp.domain;
                }
                acc.total = acc.total + comp.price;
                return acc;
            }, {
                maxPrice: item.base_price,
                minSite: 'dentalkart.com',
                maxSite: 'dentalkart.com',
                minPrice: item.base_price,
                total: item.base_price,
            });
            writeStream.write(`${item.name},${item.product_code},${item.brand.name},${item.categories.length
                ? item.categories.map((c, index) => `${c.title} `)
                : '-'},${item.market_position},${itemIndex},${minPrice},${maxPrice},${item.product_competitors.length
                ? (total / (item.product_competitors.length + 1)).toFixed(2)
                : '-'},${item.base_price},${minSite},${maxSite},${item.in_stock ? 'In Stock' : 'Out of Stock'},${addittionalColumns.join(',')}\n`);
        }
        writeStream.end();
        writeStream.on('finish', async () => {
            const readStream = fs.createReadStream(filepath);
            res.setHeader('Content-Disposition', `attachment; filename=${filepath}`);
            res.setHeader('Content-Type', 'text/csv');
            readStream.on('end', () => {
                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('temporary report file deleted successfully!');
                });
            });
            try {
                const uploadedFilename = `report_${(0, date_helper_1.formatDateString)(new Date())}.csv`;
                const reportFileURL = await this.S3Service.uploadFileToS3(`reports/${uploadedFilename}`, readStream);
                const report = await report_files_entity_1.ReportFiles.create({
                    report_file: reportFileURL,
                    filter_options: filterOptions,
                    filename: uploadedFilename,
                });
                console.log('Report URL', reportFileURL);
                res.json({ fileurl: reportFileURL });
            }
            catch (e) {
                console.log('Error', e);
            }
        });
    }
    async getProductIdsFromPriceVariation(start, end, variation_type) {
        const list = await this.StatsService.getPriceVariation(start, end, true);
        const productIds = list.reduce((acc, item) => {
            if (variation_type === price_variation_enum.INCREASE &&
                item.dataValues.price_increase != '0') {
                acc.push(item.product_id);
            }
            if (variation_type === price_variation_enum.DECREASE &&
                item.dataValues.price_decrease != '0') {
                acc.push(item.product_id);
            }
            return acc;
        }, []);
        return productIds;
    }
    async completeListForScraping(page) {
        const size = 10;
        const list = await product_entity_1.Product.findAndCountAll({
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
        const product = await this.get(id);
        for (let competitor of product.product_competitors) {
            await competitor.destroy();
        }
        await product.destroy();
    }
    async updateMarketPosition(product) {
        const competitors = await product_competitor_entity_1.ProductCompetitor.findAll({
            where: { product_id: product.id },
            include: [{ model: configuration_entity_1.Configuration, where: { is_active: true } }],
        });
        const { sum, max, min } = competitors.reduce((acc, competitor) => {
            return {
                sum: acc.sum + competitor.price,
                min: Math.min(acc.min, competitor.price),
                max: Math.max(acc.max, competitor.price),
            };
        }, {
            sum: 0,
            min: Infinity,
            max: -Infinity,
        });
        const avg = sum / competitors.length;
        let marketPosition = null;
        if (product.base_price == avg) {
            marketPosition = product_entity_1.marketPositionType.AVERAGE;
        }
        else if (product.base_price < avg && product.base_price > min)
            marketPosition = product_entity_1.marketPositionType.CHEAPER;
        else if (product.base_price <= min)
            marketPosition = product_entity_1.marketPositionType.CHEAPEST;
        else if (product.base_price < max && product.base_price > avg)
            marketPosition = product_entity_1.marketPositionType.COSTLIER;
        else if (product.base_price >= max)
            marketPosition = product_entity_1.marketPositionType.COSTLIEST;
        product.set({ market_position: marketPosition });
        await product.save();
    }
    async addCategory(product_id, category_id) {
        await this.ProductCategoryService.create(product_id, category_id);
    }
    async removeCategory(product_id, category_id) {
        await this.ProductCategoryService.remove(product_id, category_id);
    }
    async updateInStock(product, inStock) {
        product.set({ in_stock: inStock });
        await product.save();
    }
    getSortingParams(priceOrder, productCodeOrder, nameOrder, competitorCountOrder, createdAtOrder, marketPosition) {
        if (marketPosition) {
            if (marketPosition === product_entity_1.marketPositionType.CHEAPER ||
                marketPosition === product_entity_1.marketPositionType.CHEAPEST)
                return [sequelize_1.Sequelize.literal('base_price'), query_params_pipe_1.sorting_order.ASC];
            if (marketPosition === product_entity_1.marketPositionType.COSTLIER ||
                marketPosition === product_entity_1.marketPositionType.COSTLIEST)
                return [sequelize_1.Sequelize.literal('base_price'), query_params_pipe_1.sorting_order.DESC];
        }
        if (priceOrder)
            return [sequelize_1.Sequelize.literal('base_price'), priceOrder];
        if (productCodeOrder)
            return [sequelize_1.Sequelize.literal('product_code'), productCodeOrder];
        if (nameOrder)
            return [sequelize_1.Sequelize.literal('name'), nameOrder];
        if (competitorCountOrder)
            return [sequelize_1.Sequelize.literal('competitor_count'), competitorCountOrder];
        if (createdAtOrder)
            return [sequelize_1.Sequelize.literal('created_at'), createdAtOrder];
        return [sequelize_1.Sequelize.literal('created_at'), query_params_pipe_1.sorting_order.DESC];
    }
    getSearchParams(product_code_or_name, product_code, product_name, price, price_comparison, market_position, in_stock) {
        const queryObj = {};
        if (product_code)
            queryObj.product_code = { [sequelize_1.Op.like]: `%${product_code}%` };
        if (product_name)
            queryObj.name = { [sequelize_1.Op.like]: `%${product_name}%` };
        if (price && price_comparison)
            queryObj.base_price = { [sequelize_1.Op[price_comparison]]: price };
        if (market_position)
            queryObj.market_position = market_position;
        if (in_stock !== undefined)
            queryObj.in_stock = in_stock;
        if (product_code_or_name) {
            queryObj[sequelize_1.Op.or] = {
                product_code: { [sequelize_1.Op.like]: `%${product_code_or_name}%` },
                name: { [sequelize_1.Op.like]: `%${product_code_or_name}%` },
            };
        }
        return queryObj;
    }
    async fetchProductInfo(product_url) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(env_1.default.dentalkart_product_api_url, {
                data: {
                    url_key: product_url,
                },
                headers: {
                    'x-api-key': env_1.default.dentalkart_product_api_key,
                },
            }));
            return [200, 201].indexOf(response.status) === -1 ? null : response === null || response === void 0 ? void 0 : response.data;
        }
        catch (err) {
            console.log(err);
        }
    }
};
ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [produuct_category_service_1.ProductCategoryService,
        category_service_1.CategoryService,
        axios_1.HttpService,
        brand_service_1.BrandService,
        stats_service_1.StatsService,
        configuration_service_1.ConfigurationService,
        s3_service_1.S3Service])
], ProductsService);
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map