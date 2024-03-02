import { Test, TestingModule } from '@nestjs/testing';
import { IntroBannerController } from './intro-banner.controller';
import { IntroBannerService } from './intro-banner.service';

describe('IntroBannerController', () => {
  let controller: IntroBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntroBannerController],
      providers: [IntroBannerService],
    }).compile();

    controller = module.get<IntroBannerController>(IntroBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
