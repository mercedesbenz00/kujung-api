import { Test, TestingModule } from '@nestjs/testing';
import { AgencyStoreService } from './agency-store.service';

describe('AgencyStoreService', () => {
  let service: AgencyStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyStoreService],
    }).compile();

    service = module.get<AgencyStoreService>(AgencyStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
