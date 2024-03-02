import { Module } from '@nestjs/common';
import { SearchKeywordService } from './search-keyword.service';
import { SearchKeywordController } from './search-keyword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchKeyword } from './entities/search-keyword.entity';
import { SearchKeywordTypo } from './entities/search-keyword-typo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchKeyword, SearchKeywordTypo])],
  exports: [TypeOrmModule, SearchKeywordService],
  controllers: [SearchKeywordController],
  providers: [SearchKeywordService],
})
export class SearchKeywordModule {}
