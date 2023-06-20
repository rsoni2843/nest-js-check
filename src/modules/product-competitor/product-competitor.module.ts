import { ProductCompetitorController } from './product-competitor.controller';
import { ProductCompetitorService } from './product-competitor.service';
import { Module } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { ConfigurationService } from '../configuration/configuration.service';
import { HttpService, HttpModule } from '@nestjs/axios';
import { ConfigurationModule } from '../configuration/configuration.module';
import { ProductCategoryService } from '../product-category/produuct-category.service';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { ScrapingService } from '../scraping/scraping.service';
import { BrandService } from '../brand/brand.service';
import { StatsService } from '../stats/stats.service';
import { S3Service } from 'src/utils/s3-service';

@Module({
  imports: [HttpModule],
  controllers: [ProductCompetitorController],
  providers: [
    ProductCompetitorService,
    ProductsService,
    BrandService,
    ConfigurationService,
    ProductCategoryService,
    ScrapingService,
    CategoryService,
    ScrapingService,
    StatsService,
    S3Service,
  ],
})
export class ProductCompetitorModule {}
