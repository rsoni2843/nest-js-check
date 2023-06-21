import { SchedulerService } from './scheduler.service';
import { Response } from 'express';
export declare class SchedulerController {
    private SchedulerService;
    constructor(SchedulerService: SchedulerService);
    scrape(res: Response): Promise<void>;
}
