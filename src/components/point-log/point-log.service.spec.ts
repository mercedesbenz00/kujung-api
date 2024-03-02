import { Test, TestingModule } from '@nestjs/testing';
import { PointLogService } from './point-log.service';

describe('PointLogService', () => {
  let service: PointLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointLogService],
    }).compile();

    service = module.get<PointLogService>(PointLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
