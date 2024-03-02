import { Test, TestingModule } from '@nestjs/testing';
import { WishController } from './wish.controller';
import { WishService } from './wish.service';

describe('WishController', () => {
  let controller: WishController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishController],
      providers: [WishService],
    }).compile();

    controller = module.get<WishController>(WishController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
