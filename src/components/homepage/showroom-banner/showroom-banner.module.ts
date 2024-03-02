import { Module } from '@nestjs/common';
import { ShowroomBannerService } from './showroom-banner.service';
import { ShowroomBannerController } from './showroom-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowroomBanner } from './entities/showroom-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShowroomBanner])],
  exports: [TypeOrmModule, ShowroomBannerService],
  controllers: [ShowroomBannerController],
  providers: [ShowroomBannerService],
})
export class ShowroomBannerModule {}
