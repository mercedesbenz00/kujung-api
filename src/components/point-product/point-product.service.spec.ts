import { Test, TestingModule } from '@nestjs/testing';
import { PointProductService } from './point-product.service';

describe('PointProductService', () => {
  let service: PointProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointProductService],
    }).compile();

    service = module.get<PointProductService>(PointProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
