import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BrandArgs } from './dto/brand.body';
import { Brand } from '../../database/entities/brand.entity';
import { Op, Sequelize } from 'sequelize';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class BrandService {
  async create(data: BrandArgs) {
    const existingBrand = await Brand.findOne({
      where: {
        name: data.name,
      },
    });

    if (existingBrand)
      throw new ConflictException('brand with this name already exists!');

    const brand = await Brand.create({ ...data });

    return brand;
  }

  async get(id: number) {
    const brand = await Brand.findByPk(id);

    if (!brand)
      throw new BadRequestException('brand with this id does not exist');

    return brand;
  }

  async list(page: number, size: number) {
    const brandList = await Brand.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM product WHERE product.brand_id = Brand.id)',
            ),
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

  async update(id: number, data: BrandArgs) {
    const brand = await this.get(id);

    brand.set({ ...data });

    await brand.save();

    return brand;
  }

  async delete(id: number) {
    const brand = await this.get(id);

    await brand.destroy();
  }

  async getBrandsFromIdArray(idArray: number[]) {
    const brands = await Brand.findAll({
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.in]: idArray,
        },
      },
    });
    console.log(brands.map((b) => b.name).join(' '));
    return brands.map((b) => b.name).join(' ');
  }
}
