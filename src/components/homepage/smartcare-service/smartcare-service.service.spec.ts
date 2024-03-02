import { Test, TestingModule } from '@nestjs/testing';
import { SmartcareServiceService } from './smartcare-service.service';

describe('SmartcareServiceService', () => {
  let service: SmartcareServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartcareServiceService],
    }).compile();

    service = module.get<SmartcareServiceService>(SmartcareServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
