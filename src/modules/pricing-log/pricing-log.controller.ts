import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PricingLogService } from './pricing-log.service';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
//@UseGuards(AuthGuard)
@Controller('pricing-log')
export class PricingLogController {
  constructor(private PricingLogService: PricingLogService) {}

  @Get('product/:product_id')
  async getProductLogs(
    @Param('product_id', new ParseQueryPipe(0)) productId: number,
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.PricingLogService.getProductLogs(page, size, productId);
  }

  @Get('competitor/:product_competitor_id')
  async getCompetitorLogs(
    @Param('product_competitor_id', new ParseQueryPipe(0))
    productCompetitorId: number,
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.PricingLogService.getCompetitorLogs(
      page,
      size,
      productCompetitorId,
    );
  }

  @Get('product-summary/:product_id')
  async getProductSummary(
    @Param('product_id', new ParseQueryPipe(0)) productId: number,
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.PricingLogService.getConfigurationWiseLogs(
      page,
      size,
      productId,
    );
  }
}
