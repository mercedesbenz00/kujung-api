import { Test, TestingModule } from '@nestjs/testing';
import { IntroBannerService } from './intro-banner.service';

describe('IntroBannerService', () => {
  let service: IntroBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntroBannerService],
    }).compile();

    service = module.get<IntroBannerService>(IntroBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
