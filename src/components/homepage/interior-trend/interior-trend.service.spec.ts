import { Test, TestingModule } from '@nestjs/testing';
import { InteriorTrendService } from './interior-trend.service';

describe('InteriorTrendService', () => {
  let service: InteriorTrendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteriorTrendService],
    }).compile();

    service = module.get<InteriorTrendService>(InteriorTrendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
