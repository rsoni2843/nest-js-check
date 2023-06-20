import { UploadLogsController } from './upload-logs.controller';
import { UploadLogsService } from './upload-logs.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UploadLogsController],
  providers: [UploadLogsService],
})
export class UploadLogsModule {}
