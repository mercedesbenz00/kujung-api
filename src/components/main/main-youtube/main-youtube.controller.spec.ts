import { Test, TestingModule } from '@nestjs/testing';
import { MainYoutubeController } from './main-youtube.controller';
import { MainYoutubeService } from './main-youtube.service';

describe('MainYoutubeController', () => {
  let controller: MainYoutubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainYoutubeController],
      providers: [MainYoutubeService],
    }).compile();

    controller = module.get<MainYoutubeController>(MainYoutubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
