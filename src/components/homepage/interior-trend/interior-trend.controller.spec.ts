import { Test, TestingModule } from '@nestjs/testing';
import { InteriorTrendController } from './interior-trend.controller';
import { InteriorTrendService } from './interior-trend.service';

describe('InteriorTrendController', () => {
  let controller: InteriorTrendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteriorTrendController],
      providers: [InteriorTrendService],
    }).compile();

    controller = module.get<InteriorTrendController>(InteriorTrendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
