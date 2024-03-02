import { Module } from '@nestjs/common';
import { MainYoutubeService } from './main-youtube.service';
import { MainYoutubeController } from './main-youtube.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainYoutube } from './entities/main-youtube.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainYoutube])],
  exports: [TypeOrmModule],
  controllers: [MainYoutubeController],
  providers: [MainYoutubeService],
})
export class MainYoutubeModule {}
