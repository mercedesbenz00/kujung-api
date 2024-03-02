import { ApiProperty } from '@nestjs/swagger';
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
import { OnlineHouseImageDto } from './online-house-image.dto';
import { EntityIdDto } from '../../tag/dto/create-tag.dto';

export class CreateOnlineHouseDto {
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

  @IsArray()
  @Type(() => OnlineHouseImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'OnlineHouse images',
    type: () => OnlineHouseImageDto,
  })
  onlineHouseImages: OnlineHouseImageDto[];

  @IsArray()
  @Type(() => EntityIdDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'OnlineHouse tags',
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
  @ApiProperty({
    required: false,
    description: 'view point',
  })
  view_point?: number;
}
