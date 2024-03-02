import { Test, TestingModule } from '@nestjs/testing';
import { SearchKeywordService } from './search-keyword.service';

describe('SearchKeywordService', () => {
  let service: SearchKeywordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchKeywordService],
    }).compile();

    service = module.get<SearchKeywordService>(SearchKeywordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
