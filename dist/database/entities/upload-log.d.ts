import { Model } from 'sequelize-typescript';
import { ProcessingLog } from './processing-logs';
export declare class UploadLog extends Model {
    id: number;
    uploaded_file: string;
    report_file: string;
    filename: string;
    processing_logs: ProcessingLog[];
}
