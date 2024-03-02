import { Module } from '@nestjs/common';
import { SearchTermService } from './search-term.service';
import { SearchTermController } from './search-term.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchTerm } from './entities/search-term.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchTerm])],
  exports: [TypeOrmModule],
  controllers: [SearchTermController],
  providers: [SearchTermService],
})
export class SearchTermModule {}
