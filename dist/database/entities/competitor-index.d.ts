import { Model } from 'sequelize-typescript';
import { Configuration } from './configuration.entity';
export declare class CompetitorIndex extends Model {
    id: number;
    index: number;
    found_at: Date;
    configuration: Configuration;
    configuration_id: number;
}
