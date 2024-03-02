import { Test, TestingModule } from '@nestjs/testing';
import { QuestionAndAnswerService } from './question-and-answer.service';

describe('QuestionAndAnswerService', () => {
  let service: QuestionAndAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionAndAnswerService],
    }).compile();

    service = module.get<QuestionAndAnswerService>(QuestionAndAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
