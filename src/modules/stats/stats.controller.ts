import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { DateFormatConversionPipe } from 'src/pipes/query-params.pipe';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('stats')
//@UseGuards(AuthGuard)
export class StatsController {
  constructor(private StatsService: StatsService) {}
  @Get('tracking-summary')
  async getTrackingSummary() {
    return await this.StatsService.getTrackingSummary();
  }
  @Get('marketposition')
  async getMarketPostionStats() {
    return await this.StatsService.getMarketStats();
  }

  @Get('dentalkart-index')
  async getDentalkartIndex() {
    return await this.StatsService.getCurrentIndex();
  }

  @Get('competitor-index')
  async getCompetitorIndex(
    @Query('range') range: number,
    @Query('startDate', new DateFormatConversionPipe('startDate'))
    startDate: Date,
    @Query('endDate', new DateFormatConversionPipe('endDate')) endDate: Date,
  ) {
    return await this.StatsService.getCompetitorIndex(
      range,
      startDate,
      endDate,
    );
  }

  @Get('dentalkart-historical-index')
  async dentalkartHistoricalIndex(
    @Query('range') range: number,
    @Query('startDate', new DateFormatConversionPipe('startDate'))
    startDate: Date,
    @Query('endDate', new DateFormatConversionPipe('endDate')) endDate: Date,
  ) {
    return await this.StatsService.getDentalkartHistoricalIndex(
      range,
      startDate,
      endDate,
    );
  }

  @Get('competitor-historical-index')
  async competitorHistoricalIndex(
    @Query('range') range: number,
    @Query('startDate', new DateFormatConversionPipe('startDate'))
    startDate: Date,
    @Query('endDate', new DateFormatConversionPipe('endDate')) endDate: Date,
  ) {
    return await this.StatsService.getCompetitorHistoricalIndex(
      range,
      startDate,
      endDate,
    );
  }

  @Get('price-variation')
  async priceVariation(
    @Query('startDate', new DateFormatConversionPipe('startDate')) start: Date,
    @Query('endDate', new DateFormatConversionPipe('endDate')) end: Date,
  ) {
    return await this.StatsService.getPriceVariation(start, end);
  }

  @Get('out-of-stock')
  async outOfStock() {
    return await this.StatsService.getOutOfStockInfo();
  }
}
