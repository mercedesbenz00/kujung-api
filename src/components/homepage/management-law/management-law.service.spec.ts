import { Test, TestingModule } from '@nestjs/testing';
import { ManagementLawService } from './management-law.service';

describe('ManagementLawService', () => {
  let service: ManagementLawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagementLawService],
    }).compile();

    service = module.get<ManagementLawService>(ManagementLawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
