import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
