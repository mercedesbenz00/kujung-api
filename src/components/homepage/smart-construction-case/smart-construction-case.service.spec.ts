import { Test, TestingModule } from '@nestjs/testing';
import { SmartConstructionCaseService } from './smart-construction-case.service';

describe('SmartConstructionCaseService', () => {
  let service: SmartConstructionCaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartConstructionCaseService],
    }).compile();

    service = module.get<SmartConstructionCaseService>(
      SmartConstructionCaseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
