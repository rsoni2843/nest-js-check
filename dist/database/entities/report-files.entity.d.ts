import { Model } from 'sequelize-typescript';
export declare class ReportFiles extends Model {
    id: number;
    filename: string;
    report_file: string;
    filter_options: {
        [key: string]: any;
    };
}
