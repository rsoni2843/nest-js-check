import { UploadLogsService } from './upload-logs.service';
export declare class UploadLogsController {
    private UploadLogsService;
    constructor(UploadLogsService: UploadLogsService);
    list(page: number, size: number): Promise<{
        data: import("../../database/entities/upload-log").UploadLog[];
        page: number;
        totalPages: number;
    }>;
}
