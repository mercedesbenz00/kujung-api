import { Module } from '@nestjs/common';
import { SmartStoreBannerService } from './smart-store-banner.service';
import { SmartStoreBannerController } from './smart-store-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartStoreBanner } from './entities/smart-store-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartStoreBanner])],
  exports: [TypeOrmModule],
  controllers: [SmartStoreBannerController],
  providers: [SmartStoreBannerService],
})
export class SmartStoreBannerModule {}
