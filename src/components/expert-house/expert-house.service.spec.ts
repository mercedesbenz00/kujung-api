import { Test, TestingModule } from '@nestjs/testing';
import { ExpertHouseService } from './expert-house.service';

describe('ExpertHouseService', () => {
  let service: ExpertHouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpertHouseService],
    }).compile();

    service = module.get<ExpertHouseService>(ExpertHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
