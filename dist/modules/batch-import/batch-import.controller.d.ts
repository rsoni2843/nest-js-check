/// <reference types="multer" />
import { ProcessFileArgs } from './dto/batch-import.args';
import { BatchImportService } from './batch-import.service';
import { Response } from 'express';
export declare class BatchImportController {
    private BatchImportService;
    constructor(BatchImportService: BatchImportService);
    uploadFile(file: Express.Multer.File): {
        status: string;
        message: string;
        filename: string;
    };
    test(body: any): Promise<void>;
    processUploadedFile(res: Response, data: ProcessFileArgs): Promise<void>;
}
