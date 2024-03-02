import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityIdDto } from '../../tag/dto/create-tag.dto';

export class CreateExpertHouseDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Expert house title' })
  title: string;

  @IsNotEmpty({ message: 'color_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'color code from common constants',
    required: true,
  })
  color_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'family type code from common constants',
    required: false,
  })
  family_type_code: number;

  @IsNotEmpty({ message: 'house_style_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'house style code from common constants',
    required: true,
  })
  house_style_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'house type code from common constants',
    required: false,
  })
  house_type_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'area space code from common constants',
    required: false,
  })
  area_space_code: number;

  @ApiProperty({ description: 'Status change reason', required: false })
  @IsOptional()
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Main display flag', required: false })
  @IsOptional()
  @IsBoolean()
  main_display: boolean;

  @ApiProperty({ description: 'is this month flag', required: false })
  @IsOptional()
  @IsBoolean()
  is_this_month: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'image url',
  })
  image_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb url',
  })
  thumb_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'building address',
  })
  building_addr?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'expert house content',
  })
  content?: string;

  @IsArray()
  @Type(() => EntityIdDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'ExpertHouse tags',
    isArray: true,
    example: [{ id: 1 }],
    type: () => EntityIdDto,
  })
  tags: EntityIdDto[];

  @IsNotEmpty({ message: 'product_id 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    required: true,
    default: null,
    description: 'product id',
  })
  product_id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'label id',
  })
  label_id: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'view point',
  })
  view_point?: number;
}
