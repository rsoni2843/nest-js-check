import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReportFilesService } from './report-files.service';

@Controller('report-files')
//@UseGuards(AuthGuard)
export class ReportFilesController {
  constructor(private ReportFilesService: ReportFilesService) {}
  @Get('list')
  async list(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.ReportFilesService.list(page, size);
  }
}
