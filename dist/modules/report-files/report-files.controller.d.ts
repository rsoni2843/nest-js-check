import { ReportFilesService } from './report-files.service';
export declare class ReportFilesController {
    private ReportFilesService;
    constructor(ReportFilesService: ReportFilesService);
    list(page: number, size: number): Promise<{
        data: import("../../database/entities/report-files.entity").ReportFiles[];
        page: number;
        totalPages: number;
    }>;
}
