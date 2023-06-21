"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const brand_entity_1 = require("../../database/entities/brand.entity");
const sequelize_1 = require("sequelize");
let BrandService = class BrandService {
    async create(data) {
        const existingBrand = await brand_entity_1.Brand.findOne({
            where: {
                name: data.name,
            },
        });
        if (existingBrand)
            throw new common_1.ConflictException('brand with this name already exists!');
        const brand = await brand_entity_1.Brand.create(Object.assign({}, data));
        return brand;
    }
    async get(id) {
        const brand = await brand_entity_1.Brand.findByPk(id);
        if (!brand)
            throw new common_1.BadRequestException('brand with this id does not exist');
        return brand;
    }
    async list(page, size) {
        const brandList = await brand_entity_1.Brand.findAndCountAll({
            attributes: {
                include: [
                    [
                        sequelize_1.Sequelize.literal('(SELECT COUNT(*) FROM product WHERE product.brand_id = Brand.id)'),
                        'product_count',
                    ],
                ],
            },
            offset: page * size,
            limit: size,
            order: [['created_at', 'DESC']],
        });
        return {
            data: brandList.rows,
            totalPages: Math.ceil(brandList.count / Number(size)),
        };
    }
    async update(id, data) {
        const brand = await this.get(id);
        brand.set(Object.assign({}, data));
        await brand.save();
        return brand;
    }
    async delete(id) {
        const brand = await this.get(id);
        await brand.destroy();
    }
    async getBrandsFromIdArray(idArray) {
        const brands = await brand_entity_1.Brand.findAll({
            attributes: ['id', 'name'],
            where: {
                id: {
                    [sequelize_1.Op.in]: idArray,
                },
            },
        });
        console.log(brands.map((b) => b.name).join(' '));
        return brands.map((b) => b.name).join(' ');
    }
};
BrandService = __decorate([
    (0, common_1.Injectable)()
], BrandService);
exports.BrandService = BrandService;
//# sourceMappingURL=brand.service.js.map