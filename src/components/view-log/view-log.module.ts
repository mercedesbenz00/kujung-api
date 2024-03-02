import { Module } from '@nestjs/common';
import { ViewLogService } from './view-log.service';
import { ViewLogController } from './view-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewLog } from './entities/view-log.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { Portfolio } from '../homepage/portfolio/entities/portfolio.entity';
import { Notification } from '../homepage/notification/entities/notification.entity';
import { Product } from '../product/entities/product.entity';
import { Wish } from '../wish/entities/wish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ViewLog,
      OnlineHouse,
      ExpertHouse,
      Portfolio,
      Product,
      Notification,
      Wish,
    ]),
  ],
  exports: [TypeOrmModule, ViewLogService],
  controllers: [ViewLogController],
  providers: [ViewLogService],
})
export class ViewLogModule {}
