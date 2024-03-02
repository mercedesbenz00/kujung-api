import { Test, TestingModule } from '@nestjs/testing';
import { SmartStoreBannerService } from './smart-store-banner.service';

describe('SmartStoreBannerService', () => {
  let service: SmartStoreBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartStoreBannerService],
    }).compile();

    service = module.get<SmartStoreBannerService>(SmartStoreBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
