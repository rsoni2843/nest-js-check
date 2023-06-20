import { ReportFiles } from 'src/database/entities/report-files.entity';
export declare class ReportFilesService {
    list(page: number, size: number): Promise<{
        data: ReportFiles[];
        page: number;
        totalPages: number;
    }>;
}
