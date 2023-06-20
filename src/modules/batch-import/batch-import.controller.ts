import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { ProcessFileArgs } from './dto/batch-import.args';
import { BatchImportService } from './batch-import.service';
import { Response } from 'express';
import * as fs from 'fs';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('batch-import')
//@UseGuards(AuthGuard)
export class BatchImportController {
  constructor(private BatchImportService: BatchImportService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(
            new BadRequestException('Only CSV files are allowed'),
            null,
          );
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = path.parse(file.originalname).name;
          const extension = path.parse(file.originalname).ext;
          cb(null, `${filename}_${Date.now()}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      status: 'ok',
      message: 'file uploaded successfully',
      filename: file.filename,
    };
  }

  @Post('test')
  async test(@Body() body: any) {
    return await this.BatchImportService.test(body.filename);
  }

  @Post('process-file')
  async processUploadedFile(
    @Res() res: Response,
    @Body() data: ProcessFileArgs,
  ) {
    //cecking for necessary headers
    const { csvData, headers, uploadedFileURL } =
      await this.BatchImportService.preProcess(data);

    res.json({
      message: 'file uploaded successfully',
    });

    await this.BatchImportService.processFile(
      csvData,
      headers,
      data.columnMapping,
      uploadedFileURL,
      data.competitorPattern,
    );

    fs.unlink(`./uploads/${data.filename}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('temporary uploaded File deleted successfully!');
    });
  }
}
