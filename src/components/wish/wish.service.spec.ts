import { Test, TestingModule } from '@nestjs/testing';
import { WishService } from './wish.service';

describe('WishService', () => {
  let service: WishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishService],
    }).compile();

    service = module.get<WishService>(WishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
