import { Test, TestingModule } from '@nestjs/testing';
import { SmartStoreBannerController } from './smart-store-banner.controller';
import { SmartStoreBannerService } from './smart-store-banner.service';

describe('SmartStoreBannerController', () => {
  let controller: SmartStoreBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartStoreBannerController],
      providers: [SmartStoreBannerService],
    }).compile();

    controller = module.get<SmartStoreBannerController>(
      SmartStoreBannerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
