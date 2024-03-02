import { Test, TestingModule } from '@nestjs/testing';
import { MainInstagramController } from './main-instagram.controller';
import { MainInstagramService } from './main-instagram.service';

describe('MainInstagramController', () => {
  let controller: MainInstagramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainInstagramController],
      providers: [MainInstagramService],
    }).compile();

    controller = module.get<MainInstagramController>(MainInstagramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
