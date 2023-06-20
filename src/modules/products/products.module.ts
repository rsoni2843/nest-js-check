import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ProductCategoryService } from '../product-category/produuct-category.service';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { HttpModule } from '@nestjs/axios';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import { ProductCompetitorModule } from '../product-competitor/product-competitor.module';
import { ConfigurationService } from '../configuration/configuration.service';
import { ScrapingService } from '../scraping/scraping.service';
import { BrandService } from '../brand/brand.service';
import { StatsService } from '../stats/stats.service';
import { S3Service } from 'src/utils/s3-service';

@Module({
  imports: [CategoryModule, HttpModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductCategoryService,
    CategoryService,
    BrandService,
    StatsService,
    S3Service,
    ConfigurationService,
    // ProductCompetitorService,
    // ConfigurationService,
    // ScrapingService,
  ],
})
export class ProductsModule {}
