import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ProductCategory } from './database/entities/product-category';
import { Product } from './database/entities/product.entity';

@Controller('health')
export class AppController {
  @Get()
  check(): string {
    return 'Service is up and running';
  }
  @Get('testing')
  auth_check(): string {
    return 'Testing Pipeline';
  }
  @Get('test')
  async populate() {
    const productCategory = await ProductCategory.findAll();

    for (let o of productCategory) {
      const p = await Product.findByPk(o.product_id);

      p.set({ brand_id: o.category_id });

      await p.save();
    }

    return 'done';
  }
}
