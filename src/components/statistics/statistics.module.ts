import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { QuestionAndAnswer } from '../question-and-answer/entities/question-and-answer.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitLog,
      OnlineHouse,
      ExpertHouse,
      User,
      QuestionAndAnswer,
    ]),
  ],
  exports: [TypeOrmModule, StatisticsService],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
