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
exports.ProductPricingLog = exports.status_enum = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_entity_1 = require("./product.entity");
var status_enum;
(function (status_enum) {
    status_enum["SUCCESS"] = "success";
    status_enum["FAILURE"] = "failure";
})(status_enum = exports.status_enum || (exports.status_enum = {}));
let ProductPricingLog = class ProductPricingLog extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProductPricingLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_entity_1.Product),
    __metadata("design:type", product_entity_1.Product)
], ProductPricingLog.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_entity_1.Product),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
    }),
    __metadata("design:type", Number)
], ProductPricingLog.prototype, "product_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.FLOAT.UNSIGNED,
        allowNull: false,
        comment: 'price before updating',
    }),
    __metadata("design:type", Number)
], ProductPricingLog.prototype, "price_before", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.FLOAT.UNSIGNED,
        allowNull: false,
        comment: `price after updating`,
    }),
    __metadata("design:type", Number)
], ProductPricingLog.prototype, "price_after", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false, defaultValue: new Date() }),
    __metadata("design:type", Date)
], ProductPricingLog.prototype, "found_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.ENUM,
        allowNull: false,
        values: Object.values(status_enum),
    }),
    __metadata("design:type", String)
], ProductPricingLog.prototype, "status", void 0);
ProductPricingLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'product_pricing_log',
        timestamps: false,
    })
], ProductPricingLog);
exports.ProductPricingLog = ProductPricingLog;
//# sourceMappingURL=product-pricing-log.entity.js.map