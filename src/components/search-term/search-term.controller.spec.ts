import { Test, TestingModule } from '@nestjs/testing';
import { SearchTermController } from './search-term.controller';
import { SearchTermService } from './search-term.service';

describe('SearchTermController', () => {
  let controller: SearchTermController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchTermController],
      providers: [SearchTermService],
    }).compile();

    controller = module.get<SearchTermController>(SearchTermController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
