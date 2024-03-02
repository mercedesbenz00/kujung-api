import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../../shared/dtos';

export class SearchPortfolioDto extends PageOptionsDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    type: [String],
    isArray: true,
    example: ['brand', 'convention', 'artist'],
    description: 'category list. {brand, convention, artist}',
  })
  @IsArray()
  @IsString({ each: true })
  categoryList: string[];

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'From date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  from?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'To date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  to?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'name',
    required: false,
    description: 'query type to search: { title }',
  })
  q_type?: string = 'title';

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
