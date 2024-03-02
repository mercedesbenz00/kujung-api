import { Test, TestingModule } from '@nestjs/testing';
import { DetailedQuotationController } from './detailed-quotation.controller';
import { DetailedQuotationService } from './detailed-quotation.service';

describe('DetailedQuotationController', () => {
  let controller: DetailedQuotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailedQuotationController],
      providers: [DetailedQuotationService],
    }).compile();

    controller = module.get<DetailedQuotationController>(
      DetailedQuotationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
