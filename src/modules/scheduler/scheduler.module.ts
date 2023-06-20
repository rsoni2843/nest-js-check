import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { Module } from '@nestjs/common';
import { PricingLogService } from '../pricing-log/pricing-log.service';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import { ScrapingService } from '../scraping/scraping.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigurationService } from '../configuration/configuration.service';
import { ProductsService } from '../products/products.service';
import { ProductCategoryService } from '../product-category/produuct-category.service';
import { CategoryService } from '../category/category.service';
import { BrandService } from '../brand/brand.service';
import { StatsService } from '../stats/stats.service';
import { S3Service } from 'src/utils/s3-service';
@Module({
  imports: [HttpModule],
  controllers: [SchedulerController],
  providers: [
    SchedulerService,
    ScrapingService,
    PricingLogService,
    ProductCompetitorService,
    ConfigurationService,
    ProductsService,
    BrandService,
    ProductCategoryService,
    CategoryService,
    StatsService,
    S3Service,
  ],
})
export class SchedulerModule {}
