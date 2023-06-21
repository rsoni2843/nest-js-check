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
exports.Configuration = exports.queryType = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_competitor_entity_1 = require("./product-competitor.entity");
const sequelize_typescript_2 = require("sequelize-typescript");
const competitor_index_1 = require("./competitor-index");
const dom_query_entity_1 = require("./dom_query.entity");
var queryType;
(function (queryType) {
    queryType["PRICE"] = "price";
    queryType["STOCK"] = "stock";
})(queryType = exports.queryType || (exports.queryType = {}));
let Configuration = class Configuration extends sequelize_typescript_2.Model {
};
__decorate([
    sequelize_typescript_2.PrimaryKey,
    sequelize_typescript_2.AutoIncrement,
    sequelize_typescript_2.NotNull,
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
        comment: `configuration ID`,
    }),
    __metadata("design:type", Number)
], Configuration.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
        comment: 'query to reach DOM element',
    }),
    __metadata("design:type", String)
], Configuration.prototype, "price_dom_query", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
        comment: 'query to reach Stock DOM element',
    }),
    __metadata("design:type", String)
], Configuration.prototype, "stock_dom_query", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
        comment: 'query to reach Pattern of stock',
    }),
    __metadata("design:type", String)
], Configuration.prototype, "stock_pattern", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Configuration.prototype, "domain", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Configuration.prototype, "base_url", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Configuration.prototype, "jsRendering", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_1.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Configuration.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => dom_query_entity_1.DOM_Query),
    __metadata("design:type", Array)
], Configuration.prototype, "dom_queries", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_competitor_entity_1.ProductCompetitor),
    __metadata("design:type", Array)
], Configuration.prototype, "product_competitors", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => competitor_index_1.CompetitorIndex),
    __metadata("design:type", Array)
], Configuration.prototype, "competitor_indices", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Configuration.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Configuration.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({ type: sequelize_1.DATE }),
    __metadata("design:type", Date)
], Configuration.prototype, "deleted_at", void 0);
Configuration = __decorate([
    (0, sequelize_typescript_2.Table)({
        tableName: 'configuration',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    })
], Configuration);
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.entity.js.map