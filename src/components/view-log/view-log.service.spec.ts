import { Test, TestingModule } from '@nestjs/testing';
import { ViewLogService } from './view-log.service';

describe('ViewLogService', () => {
  let service: ViewLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewLogService],
    }).compile();

    service = module.get<ViewLogService>(ViewLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
