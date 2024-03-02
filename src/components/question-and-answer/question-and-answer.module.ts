import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { QuestionAndAnswerService } from './question-and-answer.service';
import { QuestionAndAnswerController } from './question-and-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionAndAnswer } from './entities/question-and-answer.entity';
import { QuestionImage } from './entities/question-image.entity';
import { AnswerImage } from './entities/answer-image.entity';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      QuestionAndAnswer,
      Admin,
      QuestionImage,
      AnswerImage,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [QuestionAndAnswerController],
  providers: [QuestionAndAnswerService],
})
export class QuestionAndAnswerModule {}
