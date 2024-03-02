import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLogModule } from '../point-log/point-log.module';
import { Like } from './entities/like.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { ExpertHouseLikeCount } from '../expert-house/entities/expert-house-like-count.entity';
import { OnlineHouseLikeCount } from '../online-house/entities/online-house-like-count.entity';
import { Notification } from '../homepage/notification/entities/notification.entity';
import { Portfolio } from '../homepage/portfolio/entities/portfolio.entity';
import { SmartStore } from '../smart-store/entities/smart-store.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    PointLogModule,
    TypeOrmModule.forFeature([
      Like,
      OnlineHouse,
      ExpertHouse,
      Notification,
      Portfolio,
      SmartStore,
      User,
      ExpertHouseLikeCount,
      OnlineHouseLikeCount,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
