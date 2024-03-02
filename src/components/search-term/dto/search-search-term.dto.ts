import { IsOptional, IsBoolean, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';
import { SearchTermType } from './create-search-term.dto';

export class SearchSearchTermDto extends PageOptionsDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'Display flag',
  })
  display?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'Display flag in main',
  })
  main_display?: boolean;

  @IsOptional()
  @IsEnum(SearchTermType)
  @ApiProperty({
    description: 'Search term type {recommend, popular}',
    required: false,
  })
  type?: SearchTermType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;
}
