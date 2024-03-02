import { Test, TestingModule } from '@nestjs/testing';
import { SmartStoreService } from './smart-store.service';

describe('SmartStoreService', () => {
  let service: SmartStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartStoreService],
    }).compile();

    service = module.get<SmartStoreService>(SmartStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
