import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchTermDto } from './create-search-term.dto';

export class UpdateSearchTermDto extends PartialType(CreateSearchTermDto) {}
