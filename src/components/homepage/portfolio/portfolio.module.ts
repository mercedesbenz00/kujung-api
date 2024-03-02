import { Module } from '@nestjs/common';
import { ViewLogModule } from '../../view-log/view-log.module';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioImage } from './entities/portfolio-image.entity';
import { Like } from '../../like/entities/like.entity';

@Module({
  imports: [
    ViewLogModule,
    TypeOrmModule.forFeature([Portfolio, PortfolioImage, Like]),
  ],
  exports: [TypeOrmModule, PortfolioService],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
