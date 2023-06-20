import { Injectable } from '@nestjs/common';
import { UploadLog } from 'src/database/entities/upload-log';

@Injectable()
export class UploadLogsService {
  async list(page: number, size: number) {
    const logs = await UploadLog.findAndCountAll({
      order: [['id', 'desc']],
      limit: size,
      offset: page * size,
    });

    return {
      data: logs.rows,
      page: page,
      totalPages: Math.ceil(logs.count / Number(size)),
    };
  }
}
