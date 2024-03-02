import { Test, TestingModule } from '@nestjs/testing';
import { SmsDeliveryController } from './sms-delivery.controller';
import { SmsDeliveryService } from './sms-delivery.service';

describe('SmsDeliveryController', () => {
  let controller: SmsDeliveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsDeliveryController],
      providers: [SmsDeliveryService],
    }).compile();

    controller = module.get<SmsDeliveryController>(SmsDeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
