import { Test, TestingModule } from '@nestjs/testing';
import { CommonConstantService } from './common-constant.service';

describe('CommonConstantService', () => {
  let service: CommonConstantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonConstantService],
    }).compile();

    service = module.get<CommonConstantService>(CommonConstantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
