import { Test, TestingModule } from '@nestjs/testing';
import { SearchTermService } from './search-term.service';

describe('SearchTermService', () => {
  let service: SearchTermService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchTermService],
    }).compile();

    service = module.get<SearchTermService>(SearchTermService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
