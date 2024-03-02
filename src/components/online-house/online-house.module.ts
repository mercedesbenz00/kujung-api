import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ViewLogModule } from '../view-log/view-log.module';
import { PointLogModule } from '../point-log/point-log.module';
import { OnlineHouseService } from './online-house.service';
import { OnlineHouseController } from './online-house.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineHouse } from './entities/online-house.entity';
import { OnlineHouseTag } from './entities/online-house-tag.entity';
import { OnlineHouseImage } from './entities/online-house-image.entity';
import { OnlineHousePopularity } from './entities/online-house-popularity.entity';
import { OnlineHouseLikeCount } from './entities/online-house-like-count.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Product } from '../product/entities/product.entity';
import { Like } from '../like/entities/like.entity';
import { Wish } from '../wish/entities/wish.entity';

@Module({
  imports: [
    UsersModule,
    ViewLogModule,
    PointLogModule,
    TypeOrmModule.forFeature([
      OnlineHouse,
      Admin,
      Tag,
      OnlineHouseTag,
      OnlineHouseImage,
      OnlineHousePopularity,
      OnlineHouseLikeCount,
      Product,
      Like,
      Wish,
    ]),
  ],
  exports: [TypeOrmModule, OnlineHouseService],
  controllers: [OnlineHouseController],
  providers: [OnlineHouseService],
})
export class OnlineHouseModule {}
