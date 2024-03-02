import { Test, TestingModule } from '@nestjs/testing';
import { SmartcareServiceController } from './smartcare-service.controller';
import { SmartcareServiceService } from './smartcare-service.service';

describe('SmartcareServiceController', () => {
  let controller: SmartcareServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartcareServiceController],
      providers: [SmartcareServiceService],
    }).compile();

    controller = module.get<SmartcareServiceController>(
      SmartcareServiceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
