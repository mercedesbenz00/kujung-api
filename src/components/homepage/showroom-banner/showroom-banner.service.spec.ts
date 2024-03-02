import { Test, TestingModule } from '@nestjs/testing';
import { ShowroomBannerService } from './showroom-banner.service';

describe('ShowroomBannerService', () => {
  let service: ShowroomBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowroomBannerService],
    }).compile();

    service = module.get<ShowroomBannerService>(ShowroomBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
