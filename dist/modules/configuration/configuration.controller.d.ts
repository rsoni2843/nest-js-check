import { ConfigurationCreateArgs, ConfigurationUpdateArgs } from './dto/configuration.dto';
import { ConfigurationService } from './configuration.service';
export declare class ConfigurationController {
    private ConfigurationService;
    constructor(ConfigurationService: ConfigurationService);
    create(data: ConfigurationCreateArgs): Promise<import("../../database/entities/configuration.entity").Configuration>;
    getByDomain(domain: string): Promise<{
        exists: boolean;
    }>;
    list(page: number, size: number, dropdown_list: boolean): Promise<{
        data: import("../../database/entities/configuration.entity").Configuration[];
        totalPages: number;
    }>;
    get(id: number): Promise<import("../../database/entities/configuration.entity").Configuration>;
    update(id: number, data: ConfigurationUpdateArgs): Promise<import("../../database/entities/configuration.entity").Configuration>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
