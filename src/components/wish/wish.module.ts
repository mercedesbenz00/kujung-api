import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { SmartStore } from '../smart-store/entities/smart-store.entity';
import { Product } from '../product/entities/product.entity';
import { ExpertHouseModule } from '../expert-house/expert-house.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wish,
      OnlineHouse,
      ExpertHouse,
      SmartStore,
      Product,
    ]),
    ExpertHouseModule,
  ],
  exports: [TypeOrmModule],
  controllers: [WishController],
  providers: [WishService],
})
export class WishModule {}
