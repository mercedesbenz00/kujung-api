import { Module } from '@nestjs/common';
import { MainBannerService } from './main-banner.service';
import { MainBannerController } from './main-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainBanner } from './entities/main-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MainBanner])],
  exports: [TypeOrmModule],
  controllers: [MainBannerController],
  providers: [MainBannerService],
})
export class MainBannerModule {}
