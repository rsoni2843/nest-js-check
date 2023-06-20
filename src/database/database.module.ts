import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';

@Module({
  providers: [...databaseProviders],
})
export class DatabaseModule {
  constructor() {
    // uncomment below line to seed order status-state
    // new OrderStatusSeeder().seedOrderStatuses();
  }
}
