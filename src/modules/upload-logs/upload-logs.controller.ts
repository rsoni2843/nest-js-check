/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { UploadLogsService } from './upload-logs.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('upload-logs')
//@UseGuards(AuthGuard)
export class UploadLogsController {
  constructor(private UploadLogsService: UploadLogsService) {}
  @Get('list')
  async list(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.UploadLogsService.list(page, size);
  }
}
