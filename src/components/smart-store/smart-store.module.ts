import { Module } from '@nestjs/common';
import { SmartStoreService } from './smart-store.service';
import { SmartStoreController } from './smart-store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartStore } from './entities/smart-store.entity';
import { Wish } from '../wish/entities/wish.entity';
import { Like } from '../like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartStore, Wish, Like])],
  exports: [TypeOrmModule],
  controllers: [SmartStoreController],
  providers: [SmartStoreService],
})
export class SmartStoreModule {}
