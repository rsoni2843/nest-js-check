import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CategoryArgs } from './dto/category.body';
import { Category } from '../../database/entities/category.entity';
import { Op, Sequelize } from 'sequelize';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class CategoryService {
  async create(data: CategoryArgs) {
    const existingCategory = await Category.findOne({
      where: {
        title: data.title,
      },
    });

    if (existingCategory)
      throw new ConflictException('category with this title already exists!');

    const category = await Category.create({ ...data });

    return category;
  }

  async get(id: number) {
    const category = await Category.findByPk(id);

    if (!category)
      throw new BadRequestException('category with this id does not exist');

    return category;
  }

  async list(page: number, size: number) {
    const categoryList = await Category.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM product_category WHERE product_category.category_id = Category.id)',
            ),
            'product_count',
          ],
        ],
      },

      // group: ['Category.id'],
      offset: page * size,
      limit: size,
      order: [['created_at', 'DESC']],
    });

    return {
      data: categoryList.rows,
      totalPages: Math.ceil(categoryList.count / Number(size)),
    };
  }

  async update(id: number, data: CategoryArgs) {
    const category = await this.get(id);

    category.set({ ...data });

    await category.save();

    return category;
  }

  async deleteCategory(id: number) {
    const category = await this.get(id);

    await category.destroy({ force: true });
  }

  async getCategoriesFromIdArray(idArray: number[]) {
    const categories = await Category.findAll({
      attributes: ['id', 'title'],
      where: {
        id: {
          [Op.in]: idArray,
        },
      },
    });

    return categories.map((c) => c.title).join(' ');
  }
}
