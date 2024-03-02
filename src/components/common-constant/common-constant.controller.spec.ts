import { Test, TestingModule } from '@nestjs/testing';
import { CommonConstantController } from './common-constant.controller';
import { CommonConstantService } from './common-constant.service';

describe('CommonConstantController', () => {
  let controller: CommonConstantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonConstantController],
      providers: [CommonConstantService],
    }).compile();

    controller = module.get<CommonConstantController>(CommonConstantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
