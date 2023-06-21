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
exports.Product = exports.marketPositionType = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const category_entity_1 = require("./category.entity");
const product_category_1 = require("./product-category");
const product_competitor_entity_1 = require("./product-competitor.entity");
const product_pricing_log_entity_1 = require("./product-pricing-log.entity");
const brand_entity_1 = require("./brand.entity");
var marketPositionType;
(function (marketPositionType) {
    marketPositionType["CHEAPEST"] = "cheapest";
    marketPositionType["AVERAGE"] = "average";
    marketPositionType["COSTLIER"] = "costlier";
    marketPositionType["CHEAPER"] = "cheaper";
    marketPositionType["COSTLIEST"] = "costliest";
})(marketPositionType = exports.marketPositionType || (exports.marketPositionType = {}));
let Product = class Product extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.NotNull,
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.STRING, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.TEXT, allowNull: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => category_entity_1.Category, () => product_category_1.ProductCategory),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    sequelize_typescript_1.IsUrl,
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.TEXT, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "product_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.FLOAT.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], Product.prototype, "base_price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.STRING, allowNull: false }),
    __metadata("design:type", String)
], Product.prototype, "product_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.STRING }),
    __metadata("design:type", String)
], Product.prototype, "bar_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.ENUM,
        values: Object.values(marketPositionType),
    }),
    __metadata("design:type", String)
], Product.prototype, "market_position", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => brand_entity_1.Brand),
    __metadata("design:type", brand_entity_1.Brand)
], Product.prototype, "brand", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => brand_entity_1.Brand),
    __metadata("design:type", Number)
], Product.prototype, "brand_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_pricing_log_entity_1.ProductPricingLog),
    __metadata("design:type", Array)
], Product.prototype, "pricing_logs", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_competitor_entity_1.ProductCompetitor),
    __metadata("design:type", Array)
], Product.prototype, "product_competitors", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE }),
    __metadata("design:type", Date)
], Product.prototype, "deleted_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.BOOLEAN, allowNull: false, defaultValue: false, comment: 'In stock status' }),
    __metadata("design:type", Boolean)
], Product.prototype, "in_stock", void 0);
Product = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'product',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    })
], Product);
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map