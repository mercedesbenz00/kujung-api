import { Test, TestingModule } from '@nestjs/testing';
import { GlobalSearchController } from './global-search.controller';
import { GlobalSearchService } from './global-search.service';

describe('GlobalSearchController', () => {
  let controller: GlobalSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalSearchController],
      providers: [GlobalSearchService],
    }).compile();

    controller = module.get<GlobalSearchController>(GlobalSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
