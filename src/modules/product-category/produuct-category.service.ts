import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductCategory } from '../../database/entities/product-category';
import { Category } from '../../database/entities/category.entity';

@Injectable()
export class ProductCategoryService {
  async create(productId: number, categoryId: number) {
    const category = await Category.findByPk(categoryId);

    if (!category) throw new BadRequestException('invalid category');

    const productCategory = await ProductCategory.findOne({
      where: {
        product_id: productId,
      },
    });

    if (productCategory) {
      productCategory.set({ category_id: categoryId });
      await productCategory.save();
      return;
    }

    await ProductCategory.create({
      product_id: productId,
      category_id: category.id,
    });
  }
  async update(productId: number, categoryId: number) {
    const productCategory = await ProductCategory.findOne({
      where: {
        product_id: productId,
      },
    });

    if (productCategory) {
      productCategory.set({ category_id: categoryId });
      await productCategory.save();
      return;
    }

    await ProductCategory.create({
      product_id: productId,
      category_id: categoryId,
    });
  }
  async remove(productId: number, categoryId: number) {
    const productCategory = await ProductCategory.findOne({
      where: {
        product_id: productId,
        category_id: categoryId,
      },
    });

    if (!productCategory) {
      throw new BadRequestException('unable to remove product from category');
    }

    await productCategory.destroy();
  }
}
