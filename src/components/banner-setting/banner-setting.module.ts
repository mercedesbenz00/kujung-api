import { Module } from '@nestjs/common';
import { BannerSettingService } from './banner-setting.service';
import { BannerSettingController } from './banner-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerSetting } from './entities/banner-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannerSetting])],
  exports: [TypeOrmModule],
  controllers: [BannerSettingController],
  providers: [BannerSettingService],
})
export class BannerSettingModule {}
