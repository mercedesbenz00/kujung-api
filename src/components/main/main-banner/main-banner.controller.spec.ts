import { Test, TestingModule } from '@nestjs/testing';
import { MainBannerController } from './main-banner.controller';
import { MainBannerService } from './main-banner.service';

describe('MainBannerController', () => {
  let controller: MainBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainBannerController],
      providers: [MainBannerService],
    }).compile();

    controller = module.get<MainBannerController>(MainBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
