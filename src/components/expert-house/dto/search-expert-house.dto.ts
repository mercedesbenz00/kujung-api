import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchExpertHouseDto extends PageOptionsDto {
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
  color_list: number[];

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
  family_type_list: number[];

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
  style_list: number[];

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
  area_space_list: number[];

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
  house_type_list: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'ExpertHouse tag ids',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  tags: number[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'requested_at',
    required: false,
    description:
      'date type to search: { requested_at | rejected_at | approved_at }',
  })
  date_type?: string = 'requested_at';

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
    default: 'expert_houses.title',
    required: false,
    description:
      'query type to search: { expert_houses.title || requester.name }',
  })
  q_type?: string = 'requester.name';

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'main_display filtering',
  })
  main_display?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'requester id',
  })
  requester_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'status, 0: waiting, 1: approved, 2: rejected',
  })
  status?: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'status list. status, 0: waiting, 1: approved, 2: rejected',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  status_list: number[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'this month filtering. When needs to sort by this month order, use sortBy: this_month_order',
  })
  is_this_month?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    default: null,
    description: 'category level 1 id',
  })
  category_level1_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    default: null,
    description: 'category level 2 id',
  })
  category_level2_id?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
