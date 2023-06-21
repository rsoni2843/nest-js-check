import { UploadLog } from 'src/database/entities/upload-log';
export declare class UploadLogsService {
    list(page: number, size: number): Promise<{
        data: UploadLog[];
        page: number;
        totalPages: number;
    }>;
}
