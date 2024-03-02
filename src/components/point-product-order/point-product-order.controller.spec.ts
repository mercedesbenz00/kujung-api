import { Test, TestingModule } from '@nestjs/testing';
import { PointProductOrderController } from './point-product-order.controller';
import { PointProductOrderService } from './point-product-order.service';

describe('PointProductOrderController', () => {
  let controller: PointProductOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointProductOrderController],
      providers: [PointProductOrderService],
    }).compile();

    controller = module.get<PointProductOrderController>(
      PointProductOrderController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
