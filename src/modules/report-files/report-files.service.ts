import { Injectable } from '@nestjs/common';
import { ReportFiles } from 'src/database/entities/report-files.entity';

@Injectable()
export class ReportFilesService {
  async list(page: number, size: number) {
    const logs = await ReportFiles.findAndCountAll({
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
