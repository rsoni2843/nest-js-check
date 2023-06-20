import { ReportFilesService } from './report-files.service';
import { ReportFilesController } from './report-files.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ReportFilesController],
  providers: [ReportFilesService],
})
export class ReportFilesModule {}
