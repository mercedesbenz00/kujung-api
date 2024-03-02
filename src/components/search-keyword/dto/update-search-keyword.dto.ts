import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchKeywordDto } from './create-search-keyword.dto';

export class UpdateSearchKeywordDto extends PartialType(
  CreateSearchKeywordDto,
) {}
