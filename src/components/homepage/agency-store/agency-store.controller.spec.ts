import { Test, TestingModule } from '@nestjs/testing';
import { AgencyStoreController } from './agency-store.controller';
import { AgencyStoreService } from './agency-store.service';

describe('AgencyStoreController', () => {
  let controller: AgencyStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyStoreController],
      providers: [AgencyStoreService],
    }).compile();

    controller = module.get<AgencyStoreController>(AgencyStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
