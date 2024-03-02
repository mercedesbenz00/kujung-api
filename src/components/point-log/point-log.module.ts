import { Module } from '@nestjs/common';
import { PointLogService } from './point-log.service';
import { UsersModule } from '../users/users.module';
import { PointLogController } from './point-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLog } from './entities/point-log.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PointLog])],
  exports: [TypeOrmModule, PointLogService],
  controllers: [PointLogController],
  providers: [PointLogService],
})
export class PointLogModule {}
