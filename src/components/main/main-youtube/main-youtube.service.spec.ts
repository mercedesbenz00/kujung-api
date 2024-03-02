import { Test, TestingModule } from '@nestjs/testing';
import { MainYoutubeService } from './main-youtube.service';

describe('MainYoutubeService', () => {
  let service: MainYoutubeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainYoutubeService],
    }).compile();

    service = module.get<MainYoutubeService>(MainYoutubeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
