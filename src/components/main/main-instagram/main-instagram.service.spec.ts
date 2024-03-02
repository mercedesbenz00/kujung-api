import { Test, TestingModule } from '@nestjs/testing';
import { MainInstagramService } from './main-instagram.service';

describe('MainInstagramService', () => {
  let service: MainInstagramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainInstagramService],
    }).compile();

    service = module.get<MainInstagramService>(MainInstagramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
