import { Module } from '@nestjs/common';
import { PointProductOrderService } from './point-product-order.service';
import { MemoService } from './memo.service';
import { PointProductOrderController } from './point-product-order.controller';
import { UsersModule } from '../users/users.module';
import { PointLogModule } from '../point-log/point-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointProductOrder } from './entities/point-product-order.entity';
import { PointProductOrderMemo } from './entities/point-product-order-memo.entity';
import { User } from '../users/entities/user.entity';
import { PointProduct } from '../point-product/entities/point-product.entity';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [
    UsersModule,
    PointLogModule,
    TypeOrmModule.forFeature([
      User,
      PointProduct,
      PointProductOrder,
      PointProductOrderMemo,
      Admin,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [PointProductOrderController],
  providers: [PointProductOrderService, MemoService],
})
export class PointProductOrderModule {}
