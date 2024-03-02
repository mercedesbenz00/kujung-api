import { Test, TestingModule } from '@nestjs/testing';
import { MainConstructionCaseController } from './main-construction-case.controller';
import { MainConstructionCaseService } from './main-construction-case.service';

describe('MainConstructionCaseController', () => {
  let controller: MainConstructionCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainConstructionCaseController],
      providers: [MainConstructionCaseService],
    }).compile();

    controller = module.get<MainConstructionCaseController>(
      MainConstructionCaseController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
