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
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_entity_1 = require("./product.entity");
const product_category_1 = require("./product-category");
let Category = class Category extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.NotNull,
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false, comment: 'category ID' }),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.STRING, allowNull: false }),
    __metadata("design:type", String)
], Category.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.TEXT }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => product_entity_1.Product, () => product_category_1.ProductCategory),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Category.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Category.prototype, "updated_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE }),
    __metadata("design:type", Date)
], Category.prototype, "deleted_at", void 0);
Category = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'category',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    })
], Category);
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map