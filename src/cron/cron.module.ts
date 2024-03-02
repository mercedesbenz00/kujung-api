import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CronService } from './cron.service';

import { MainInstagramModule } from '../components/main/main-instagram/main-instagram.module';
import { OnlineHouseModule } from '../components/online-house/online-house.module';
import { ExpertHouseModule } from '../components/expert-house/expert-house.module';
import { ProductModule } from '../components/product/product.module';
import { UsersModule } from '../components/users/users.module';

@Module({
  imports: [
    HttpModule,
    MainInstagramModule,
    OnlineHouseModule,
    ExpertHouseModule,
    ProductModule,
    UsersModule,
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
