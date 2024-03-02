import { Test, TestingModule } from '@nestjs/testing';
import { SmsDeliveryService } from './sms-delivery.service';

describe('SmsDeliveryService', () => {
  let service: SmsDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsDeliveryService],
    }).compile();

    service = module.get<SmsDeliveryService>(SmsDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
