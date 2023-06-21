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
exports.DOM_Query = exports.query_type = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const configuration_entity_1 = require("./configuration.entity");
const product_competitor_entity_1 = require("./product-competitor.entity");
var query_type;
(function (query_type) {
    query_type["DEFAULT"] = "default";
    query_type["GROUPED"] = "grouped";
})(query_type = exports.query_type || (exports.query_type = {}));
let DOM_Query = class DOM_Query extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.NotNull,
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], DOM_Query.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
        comment: 'query to reach DOM element',
    }),
    __metadata("design:type", String)
], DOM_Query.prototype, "price_query", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.TEXT,
        allowNull: false,
        comment: 'query to reach Stock DOM element',
    }),
    __metadata("design:type", String)
], DOM_Query.prototype, "stock_query", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.TEXT,
        allowNull: true,
        comment: 'query to reach Pattern of stock',
    }),
    __metadata("design:type", String)
], DOM_Query.prototype, "stock_pattern", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.ENUM,
        allowNull: false,
        defaultValue: query_type.GROUPED,
        values: Object.values(query_type),
    }),
    __metadata("design:type", String)
], DOM_Query.prototype, "query_type", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => configuration_entity_1.Configuration),
    __metadata("design:type", configuration_entity_1.Configuration)
], DOM_Query.prototype, "configuration", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => configuration_entity_1.Configuration),
    __metadata("design:type", Number)
], DOM_Query.prototype, "configuration_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_competitor_entity_1.ProductCompetitor),
    __metadata("design:type", Array)
], DOM_Query.prototype, "product_competitors", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], DOM_Query.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], DOM_Query.prototype, "updated_at", void 0);
DOM_Query = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'dom_query',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], DOM_Query);
exports.DOM_Query = DOM_Query;
//# sourceMappingURL=dom_query.entity.js.map