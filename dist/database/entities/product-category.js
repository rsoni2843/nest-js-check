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
exports.ProductCategory = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_entity_1 = require("./product.entity");
const category_entity_1 = require("./category.entity");
let ProductCategory = class ProductCategory extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.NotNull,
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_entity_1.Product),
    __metadata("design:type", product_entity_1.Product)
], ProductCategory.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_entity_1.Product),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "product_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => category_entity_1.Category),
    __metadata("design:type", category_entity_1.Category)
], ProductCategory.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => category_entity_1.Category),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProductCategory.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], ProductCategory.prototype, "updated_at", void 0);
ProductCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'product_category',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], ProductCategory);
exports.ProductCategory = ProductCategory;
//# sourceMappingURL=product-category.js.map