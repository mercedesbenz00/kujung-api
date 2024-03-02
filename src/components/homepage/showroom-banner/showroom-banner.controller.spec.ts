import { Test, TestingModule } from '@nestjs/testing';
import { ShowroomBannerController } from './showroom-banner.controller';
import { ShowroomBannerService } from './showroom-banner.service';

describe('ShowroomBannerController', () => {
  let controller: ShowroomBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowroomBannerController],
      providers: [ShowroomBannerService],
    }).compile();

    controller = module.get<ShowroomBannerController>(ShowroomBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
