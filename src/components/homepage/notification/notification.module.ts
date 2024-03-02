import { Module } from '@nestjs/common';
import { ViewLogModule } from '../../view-log/view-log.module';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Like } from '../../like/entities/like.entity';

@Module({
  imports: [ViewLogModule, TypeOrmModule.forFeature([Notification, Like])],
  exports: [TypeOrmModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
