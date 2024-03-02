import { Test, TestingModule } from '@nestjs/testing';
import { SmartConstructionCaseController } from './smart-construction-case.controller';
import { SmartConstructionCaseService } from './smart-construction-case.service';

describe('SmartConstructionCaseController', () => {
  let controller: SmartConstructionCaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartConstructionCaseController],
      providers: [SmartConstructionCaseService],
    }).compile();

    controller = module.get<SmartConstructionCaseController>(
      SmartConstructionCaseController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
