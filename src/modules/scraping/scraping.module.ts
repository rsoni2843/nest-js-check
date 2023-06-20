import { ScrapingService } from './scraping.service';
import { ScraperController } from './scraping.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ScraperController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
