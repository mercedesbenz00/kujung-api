import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchHouseDto extends PageOptionsDto {
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
    description: 'requester id to exclude',
  })
  exclude_requester_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'house id to exclude',
  })
  exclude_house_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'house type to apply exclude_house_id. {online, expert}',
  })
  exclude_house_type?: string;

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
  status_list?: number[];

  @IsOptional()
  @ApiProperty({
    required: false,
    type: [String],
    isArray: true,
    example: ['online', 'expert'],
    description: 'type list. {online, expert}',
  })
  @IsArray()
  @IsString({ each: true })
  entity_type_list?: string[];

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
  tags?: number[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Flag to get random items.',
  })
  random?: boolean;

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
    description: 'family type list',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  family_type_list?: number[];

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

  // @IsArray()
  // @IsOptional()
  // @IsNumber({}, { each: true })
  // @ApiPropertyOptional({
  //   required: false,
  //   type: [Number],
  //   description: 'ExpertHouse tag ids',
  //   example: [1, 2, 3],
  //   isArray: true,
  //   items: {
  //     type: 'number',
  //   },
  // })
  // tags: number[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;

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
  @ApiProperty({
    required: false,
    description: 'product id',
  })
  product_id?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'entity id',
  })
  entity_id?: number;
}
