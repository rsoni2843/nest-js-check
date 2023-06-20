import { Model } from 'sequelize-typescript';
import { UploadLog } from './upload-log';
export declare enum processing_status {
    SUCCESS = "success",
    FAILURE = "failure"
}
export declare class ProcessingLog extends Model {
    id: number;
    product_code: string;
    status: processing_status;
    message: any[];
    upload_log: UploadLog;
    upload_log_id: number;
    created_at: Date;
    updated_at: Date;
}
