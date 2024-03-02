import { Test, TestingModule } from '@nestjs/testing';
import { ManagementLawController } from './management-law.controller';
import { ManagementLawService } from './management-law.service';

describe('ManagementLawController', () => {
  let controller: ManagementLawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagementLawController],
      providers: [ManagementLawService],
    }).compile();

    controller = module.get<ManagementLawController>(ManagementLawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
