import { ReportFilesModule } from './modules/report-files/report-files.module';
import { PricingLogModule } from './modules/pricing-log/pricing-log.module';
import { BrandModule } from './modules/brand/brand.module';
import { UploadLogsModule } from './modules/upload-logs/upload-logs.module';
import { BatchImportModule } from './modules/batch-import/batch-import.module';
import { PricingLogService } from './modules/pricing-log/pricing-log.service';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { ScrapingModule } from './modules/scraping/scraping.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { ProductCompetitorModule } from './modules/product-competitor/product-competitor.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductsModule } from './modules/products/products.module';
import {
  Module,
  ValidationPipe,
  CacheModule,
  CacheInterceptor,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './filters';
//import { ApiKeyGuard } from './guards/api-key.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { StatsModule } from './modules/stats/stats.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ReportFilesModule,
    PricingLogModule,
    BrandModule,
    UploadLogsModule,
    BatchImportModule,
    ScheduleModule.forRoot(),
    MulterModule.register({ dest: './uploads' }),
    SchedulerModule,
    ScrapingModule,
    ConfigurationModule,
    ProductCompetitorModule,
    ProductCategoryModule,
    CategoryModule,
    ProductsModule,
    DatabaseModule,
    StatsModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiKeyGuard,
    // },
  ],
})
export class AppModule {}
