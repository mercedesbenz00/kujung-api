import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchProductDto extends PageOptionsDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    default: null,
    description: 'category level 1 id',
  })
  category_level1_id?: number;

  @ApiPropertyOptional({
    default: '',
    description: 'sort by field. for example, updated_at||popularity||...',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sortBy?: string = '';

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    default: null,
    description: 'category level 2 id',
  })
  category_level2_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    default: null,
    description: 'category level 3 id',
  })
  category_level3_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'product id to exclude',
  })
  exclude_product_id?: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Product tags',
  })
  tags?: number[];

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
    default: 'title',
    required: false,
    description: 'query type to search: { title | id | selected_icons}',
  })
  q_type?: string = 'title';

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'hidden filtering',
  })
  hidden?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'recommended filtering',
  })
  recommended?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'top_fixed filtering',
  })
  top_fixed?: boolean;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'area space list',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  area_space_list?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'house type list',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  house_type_list?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'color list',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  color_list?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'style list',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  style_list?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'family type list',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  family_type_list?: number[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total product count',
  })
  needAllCount?: boolean;
}
