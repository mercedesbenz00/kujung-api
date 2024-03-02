import { Test, TestingModule } from '@nestjs/testing';
import { PopupService } from './popup.service';

describe('PopupService', () => {
  let service: PopupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopupService],
    }).compile();

    service = module.get<PopupService>(PopupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
