import { Test, TestingModule } from '@nestjs/testing';
import { DetailedQuotationService } from './detailed-quotation.service';

describe('DetailedQuotationService', () => {
  let service: DetailedQuotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailedQuotationService],
    }).compile();

    service = module.get<DetailedQuotationService>(DetailedQuotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
