import { Test, TestingModule } from '@nestjs/testing';
import { ExpertHouseController } from './expert-house.controller';
import { ExpertHouseService } from './expert-house.service';

describe('ExpertHouseController', () => {
  let controller: ExpertHouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertHouseController],
      providers: [ExpertHouseService],
    }).compile();

    controller = module.get<ExpertHouseController>(ExpertHouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
