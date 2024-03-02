import { Test, TestingModule } from '@nestjs/testing';
import { PointLogController } from './point-log.controller';
import { PointLogService } from './point-log.service';

describe('PointLogController', () => {
  let controller: PointLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointLogController],
      providers: [PointLogService],
    }).compile();

    controller = module.get<PointLogController>(PointLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
