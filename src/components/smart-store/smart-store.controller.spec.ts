import { Test, TestingModule } from '@nestjs/testing';
import { SmartStoreController } from './smart-store.controller';
import { SmartStoreService } from './smart-store.service';

describe('SmartStoreController', () => {
  let controller: SmartStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartStoreController],
      providers: [SmartStoreService],
    }).compile();

    controller = module.get<SmartStoreController>(SmartStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
