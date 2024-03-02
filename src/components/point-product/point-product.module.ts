import { Module } from '@nestjs/common';
import { PointProductService } from './point-product.service';
import { PointProductController } from './point-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointProduct } from './entities/point-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointProduct])],
  exports: [TypeOrmModule],
  controllers: [PointProductController],
  providers: [PointProductService],
})
export class PointProductModule {}
