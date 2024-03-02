import { Test, TestingModule } from '@nestjs/testing';
import { PointProductOrderService } from './point-product-order.service';

describe('PointProductOrderService', () => {
  let service: PointProductOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointProductOrderService],
    }).compile();

    service = module.get<PointProductOrderService>(PointProductOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
