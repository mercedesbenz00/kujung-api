import { Test, TestingModule } from '@nestjs/testing';
import { OnlineHouseService } from './online-house.service';

describe('OnlineHouseService', () => {
  let service: OnlineHouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineHouseService],
    }).compile();

    service = module.get<OnlineHouseService>(OnlineHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
