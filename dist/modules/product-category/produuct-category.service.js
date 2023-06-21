"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategoryService = void 0;
const common_1 = require("@nestjs/common");
const product_category_1 = require("../../database/entities/product-category");
const category_entity_1 = require("../../database/entities/category.entity");
let ProductCategoryService = class ProductCategoryService {
    async create(productId, categoryId) {
        const category = await category_entity_1.Category.findByPk(categoryId);
        if (!category)
            throw new common_1.BadRequestException('invalid category');
        const productCategory = await product_category_1.ProductCategory.findOne({
            where: {
                product_id: productId,
            },
        });
        if (productCategory) {
            productCategory.set({ category_id: categoryId });
            await productCategory.save();
            return;
        }
        await product_category_1.ProductCategory.create({
            product_id: productId,
            category_id: category.id,
        });
    }
    async update(productId, categoryId) {
        const productCategory = await product_category_1.ProductCategory.findOne({
            where: {
                product_id: productId,
            },
        });
        if (productCategory) {
            productCategory.set({ category_id: categoryId });
            await productCategory.save();
            return;
        }
        await product_category_1.ProductCategory.create({
            product_id: productId,
            category_id: categoryId,
        });
    }
    async remove(productId, categoryId) {
        const productCategory = await product_category_1.ProductCategory.findOne({
            where: {
                product_id: productId,
                category_id: categoryId,
            },
        });
        if (!productCategory) {
            throw new common_1.BadRequestException('unable to remove product from category');
        }
        await productCategory.destroy();
    }
};
ProductCategoryService = __decorate([
    (0, common_1.Injectable)()
], ProductCategoryService);
exports.ProductCategoryService = ProductCategoryService;
//# sourceMappingURL=produuct-category.service.js.map