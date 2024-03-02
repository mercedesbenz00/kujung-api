import { Test, TestingModule } from '@nestjs/testing';
import { BannerSettingService } from './banner-setting.service';

describe('BannerSettingService', () => {
  let service: BannerSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BannerSettingService],
    }).compile();

    service = module.get<BannerSettingService>(BannerSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
