import { Test, TestingModule } from '@nestjs/testing';
import { PointProductController } from './point-product.controller';
import { PointProductService } from './point-product.service';

describe('PointProductController', () => {
  let controller: PointProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointProductController],
      providers: [PointProductService],
    }).compile();

    controller = module.get<PointProductController>(PointProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
