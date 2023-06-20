import { BatchImportController } from './batch-import.controller';
import { BatchImportService } from './batch-import.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import { ProductCategoryService } from '../product-category/produuct-category.service';
import { ProductsModule } from '../products/products.module';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { HttpModule } from '@nestjs/axios';
import { ScrapingService } from '../scraping/scraping.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { S3Service } from 'src/utils/s3-service';
import { BrandService } from '../brand/brand.service';
import { StatsService } from '../stats/stats.service';

@Module({
  imports: [HttpModule],
  controllers: [BatchImportController],
  providers: [
    BatchImportService,
    BrandService,
    ProductsService,
    ConfigurationService,
    CategoryService,
    ProductCategoryService,
    ScrapingService,
    ProductCompetitorService,
    S3Service,
    StatsService,
  ],
})
export class BatchImportModule {}
