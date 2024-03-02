import { Test, TestingModule } from '@nestjs/testing';
import { MainBannerService } from './main-banner.service';

describe('MainBannerService', () => {
  let service: MainBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainBannerService],
    }).compile();

    service = module.get<MainBannerService>(MainBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
