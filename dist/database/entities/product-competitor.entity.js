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
exports.ProductCompetitor = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_entity_1 = require("./product.entity");
const configuration_entity_1 = require("./configuration.entity");
const pricing_log_entity_1 = require("./pricing-log.entity");
const dom_query_entity_1 = require("./dom_query.entity");
let ProductCompetitor = class ProductCompetitor extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.NotNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
        comment: `competitor's ID`,
    }),
    __metadata("design:type", Number)
], ProductCompetitor.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.STRING, allowNull: false, comment: `competitor's name` }),
    __metadata("design:type", String)
], ProductCompetitor.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.TEXT, allowNull: false, comment: `competitor's domain` }),
    __metadata("design:type", String)
], ProductCompetitor.prototype, "domain", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.TEXT, allowNull: false, comment: `competitor's url` }),
    __metadata("design:type", String)
], ProductCompetitor.prototype, "competitor_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.FLOAT.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductCompetitor.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'In stock status',
    }),
    __metadata("design:type", Boolean)
], ProductCompetitor.prototype, "in_stock", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_entity_1.Product),
    __metadata("design:type", product_entity_1.Product)
], ProductCompetitor.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_entity_1.Product),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductCompetitor.prototype, "product_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => configuration_entity_1.Configuration),
    __metadata("design:type", configuration_entity_1.Configuration)
], ProductCompetitor.prototype, "configuration", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => configuration_entity_1.Configuration),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductCompetitor.prototype, "configuration_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => dom_query_entity_1.DOM_Query),
    __metadata("design:type", dom_query_entity_1.DOM_Query)
], ProductCompetitor.prototype, "dom_query", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => dom_query_entity_1.DOM_Query),
    __metadata("design:type", Number)
], ProductCompetitor.prototype, "dom_query_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => pricing_log_entity_1.PricingLog),
    __metadata("design:type", Array)
], ProductCompetitor.prototype, "pricing_logs", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], ProductCompetitor.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], ProductCompetitor.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE }),
    __metadata("design:type", Date)
], ProductCompetitor.prototype, "deleted_at", void 0);
ProductCompetitor = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'product_competitor',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    })
], ProductCompetitor);
exports.ProductCompetitor = ProductCompetitor;
//# sourceMappingURL=product-competitor.entity.js.map