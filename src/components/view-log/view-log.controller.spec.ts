import { Test, TestingModule } from '@nestjs/testing';
import { ViewLogController } from './view-log.controller';
import { ViewLogService } from './view-log.service';

describe('ViewLogController', () => {
  let controller: ViewLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewLogController],
      providers: [ViewLogService],
    }).compile();

    controller = module.get<ViewLogController>(ViewLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
