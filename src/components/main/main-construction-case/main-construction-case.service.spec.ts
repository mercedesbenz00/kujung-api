import { Test, TestingModule } from '@nestjs/testing';
import { MainConstructionCaseService } from './main-construction-case.service';

describe('MainConstructionCaseService', () => {
  let service: MainConstructionCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainConstructionCaseService],
    }).compile();

    service = module.get<MainConstructionCaseService>(
      MainConstructionCaseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
