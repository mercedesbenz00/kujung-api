import { Module } from '@nestjs/common';
import { InteriorTrendService } from './interior-trend.service';
import { InteriorTrendController } from './interior-trend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteriorTrend } from './entities/interior-trend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InteriorTrend])],
  exports: [TypeOrmModule, InteriorTrendService],
  controllers: [InteriorTrendController],
  providers: [InteriorTrendService],
})
export class InteriorTrendModule {}
