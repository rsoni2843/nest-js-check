import { Configuration } from '../../database/entities/configuration.entity';
import { ConfigurationCreateArgs, ConfigurationUpdateArgs } from './dto/configuration.dto';
export declare class ConfigurationService {
    create(data: ConfigurationCreateArgs): Promise<Configuration>;
    completeListForScraping(): Promise<Configuration[]>;
    get(id: number): Promise<Configuration>;
    update(id: number, data: ConfigurationUpdateArgs): Promise<Configuration>;
    list(page: number, size: number, includeCompetitorCount: boolean): Promise<{
        data: Configuration[];
        totalPages: number;
    }>;
    remove(id: number): Promise<void>;
    getByDomain(domain: string): Promise<Configuration>;
    getConfigurationsFromIdArray(idArray: number[]): Promise<string>;
}
