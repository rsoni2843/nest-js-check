import { PricingLogController } from './pricing-log.controller';
import { Module } from '@nestjs/common';
import { PricingLogService } from './pricing-log.service';

@Module({
  imports: [],
  controllers: [PricingLogController],
  providers: [PricingLogService],
})
export class PricingLogModule {}
