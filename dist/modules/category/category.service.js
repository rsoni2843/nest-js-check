"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const category_entity_1 = require("../../database/entities/category.entity");
const sequelize_1 = require("sequelize");
let CategoryService = class CategoryService {
    async create(data) {
        const existingCategory = await category_entity_1.Category.findOne({
            where: {
                title: data.title,
            },
        });
        if (existingCategory)
            throw new common_1.ConflictException('category with this title already exists!');
        const category = await category_entity_1.Category.create(Object.assign({}, data));
        return category;
    }
    async get(id) {
        const category = await category_entity_1.Category.findByPk(id);
        if (!category)
            throw new common_1.BadRequestException('category with this id does not exist');
        return category;
    }
    async list(page, size) {
        const categoryList = await category_entity_1.Category.findAndCountAll({
            attributes: {
                include: [
                    [
                        sequelize_1.Sequelize.literal('(SELECT COUNT(*) FROM product_category WHERE product_category.category_id = Category.id)'),
                        'product_count',
                    ],
                ],
            },
            offset: page * size,
            limit: size,
            order: [['created_at', 'DESC']],
        });
        return {
            data: categoryList.rows,
            totalPages: Math.ceil(categoryList.count / Number(size)),
        };
    }
    async update(id, data) {
        const category = await this.get(id);
        category.set(Object.assign({}, data));
        await category.save();
        return category;
    }
    async deleteCategory(id) {
        const category = await this.get(id);
        await category.destroy({ force: true });
    }
    async getCategoriesFromIdArray(idArray) {
        const categories = await category_entity_1.Category.findAll({
            attributes: ['id', 'title'],
            where: {
                id: {
                    [sequelize_1.Op.in]: idArray,
                },
            },
        });
        return categories.map((c) => c.title).join(' ');
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)()
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map