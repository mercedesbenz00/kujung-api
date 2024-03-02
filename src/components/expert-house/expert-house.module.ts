import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ViewLogModule } from '../view-log/view-log.module';
import { PointLogModule } from '../point-log/point-log.module';
import { ExpertHouseService } from './expert-house.service';
import { ExpertHouseController } from './expert-house.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertHouse } from './entities/expert-house.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHousePopularity } from './entities/expert-house-popularity.entity';
import { ExpertHouseLikeCount } from './entities/expert-house-like-count.entity';
import { ExpertHouseTag } from './entities/expert-house-tag.entity';
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
      ExpertHouse,
      OnlineHouse,
      Admin,
      Tag,
      ExpertHouseTag,
      ExpertHousePopularity,
      ExpertHouseLikeCount,
      Product,
      Like,
      Wish,
    ]),
  ],
  exports: [TypeOrmModule, ExpertHouseService],
  controllers: [ExpertHouseController],
  providers: [ExpertHouseService],
})
export class ExpertHouseModule {}
