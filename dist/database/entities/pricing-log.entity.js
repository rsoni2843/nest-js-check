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
exports.PricingLog = exports.status_enum = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_competitor_entity_1 = require("./product-competitor.entity");
var status_enum;
(function (status_enum) {
    status_enum["SUCCESS"] = "success";
    status_enum["FAILURE"] = "failure";
})(status_enum = exports.status_enum || (exports.status_enum = {}));
let PricingLog = class PricingLog extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], PricingLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.FLOAT.UNSIGNED,
        allowNull: false,
        comment: 'price before updating',
    }),
    __metadata("design:type", Number)
], PricingLog.prototype, "price_before", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.FLOAT.UNSIGNED,
        allowNull: false,
        comment: `price after updating`,
    }),
    __metadata("design:type", Number)
], PricingLog.prototype, "price_after", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], PricingLog.prototype, "found_at", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_competitor_entity_1.ProductCompetitor),
    __metadata("design:type", product_competitor_entity_1.ProductCompetitor)
], PricingLog.prototype, "product_competitor", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_competitor_entity_1.ProductCompetitor),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
    }),
    __metadata("design:type", Number)
], PricingLog.prototype, "product_competitor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.TEXT,
        comment: 'query to reach DOM element',
    }),
    __metadata("design:type", String)
], PricingLog.prototype, "dom_query", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.FLOAT,
        comment: 'competitor price / dentalkart price',
    }),
    __metadata("design:type", Number)
], PricingLog.prototype, "index", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.ENUM,
        allowNull: false,
        values: Object.values(status_enum),
    }),
    __metadata("design:type", String)
], PricingLog.prototype, "status", void 0);
PricingLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'pricing_log',
        timestamps: true,
        createdAt: 'found_at',
        updatedAt: false,
    })
], PricingLog);
exports.PricingLog = PricingLog;
//# sourceMappingURL=pricing-log.entity.js.map