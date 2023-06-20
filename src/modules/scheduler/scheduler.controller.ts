import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { DevelopmentGuard } from 'src/guards/development.guard';
import { SchedulerService } from './scheduler.service';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
@UseGuards(DevelopmentGuard) //this controller is only available in development mode
@Controller('scheduler')
//@UseGuards(AuthGuard)
export class SchedulerController {
  constructor(private SchedulerService: SchedulerService) {}
  // trigger to scrape manually aside from scheduled time

  @Get('scrape')
  async scrape(@Res() res: Response) {
    res.json({ message: 'Scraping started' });

    console.time('scraper took');
    await this.SchedulerService.hourlyTask();
    console.timeEnd('scraper took');
  }
}
