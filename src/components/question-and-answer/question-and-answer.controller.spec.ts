import { Test, TestingModule } from '@nestjs/testing';
import { QuestionAndAnswerController } from './question-and-answer.controller';
import { QuestionAndAnswerService } from './question-and-answer.service';

describe('QuestionAndAnswerController', () => {
  let controller: QuestionAndAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionAndAnswerController],
      providers: [QuestionAndAnswerService],
    }).compile();

    controller = module.get<QuestionAndAnswerController>(
      QuestionAndAnswerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
