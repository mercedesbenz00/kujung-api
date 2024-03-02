import { Test, TestingModule } from '@nestjs/testing';
import { OnlineHouseController } from './online-house.controller';
import { OnlineHouseService } from './online-house.service';

describe('OnlineHouseController', () => {
  let controller: OnlineHouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineHouseController],
      providers: [OnlineHouseService],
    }).compile();

    controller = module.get<OnlineHouseController>(OnlineHouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
