import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('scraper')
//@UseGuards(AuthGuard)
export class ScraperController {
  constructor(private readonly scraperService: ScrapingService) {}

  @Get()
  async scrapeData(
    @Query('url') url: string,
    @Query('render') render: boolean,
  ): Promise<any> {
    return this.scraperService.scrapeData(url, render);
  }

  @Get('get-stock-info')
  async scrapeStockInfo(
    @Query('url') url: string,
    @Query('stock_dom_query') stock_dom_query: string,
    @Query('stock_pattern') stock_pattern: string,
    @Query('render') render: boolean,
  ): Promise<any> {
    const htmlRawData = await this.scraperService.scrapeData(url, render);
    return this.scraperService.getStockInfo(
      htmlRawData,
      stock_dom_query,
      stock_pattern,
    );
  }
}
