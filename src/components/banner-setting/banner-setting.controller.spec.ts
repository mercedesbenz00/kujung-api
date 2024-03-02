import { Test, TestingModule } from '@nestjs/testing';
import { BannerSettingController } from './banner-setting.controller';
import { BannerSettingService } from './banner-setting.service';

describe('BannerSettingController', () => {
  let controller: BannerSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannerSettingController],
      providers: [BannerSettingService],
    }).compile();

    controller = module.get<BannerSettingController>(BannerSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
