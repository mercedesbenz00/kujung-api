import { Module } from '@nestjs/common';
import { IntroBannerService } from './intro-banner.service';
import { IntroBannerController } from './intro-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntroBanner } from './entities/intro-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IntroBanner])],
  exports: [TypeOrmModule, IntroBannerService],
  controllers: [IntroBannerController],
  providers: [IntroBannerService],
})
export class IntroBannerModule {}
