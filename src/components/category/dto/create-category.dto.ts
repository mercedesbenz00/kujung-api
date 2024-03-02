import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryImageDto } from './category-image.dto';
import { CategoryYoutubeDto } from './category-youtube.dto';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Category title' })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'Parent cateogry id',
  })
  parentId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'depth, 0: main, 1: sub category, 2: sub-sub category',
    default: 0,
  })
  depth?: number;

  @IsString()
  @IsNotEmpty({ message: 'image url 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'image url',
  })
  image_url?: string;

  @IsString()
  @IsNotEmpty({ message: 'desc 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'description',
  })
  desc?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'comma seprated tag string',
  })
  tags?: string;

  @IsOptional()
  @IsArray()
  @Type(() => CategoryImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    description: 'Category images',
    type: () => CategoryImageDto,
  })
  categoryImages: CategoryImageDto[];

  @IsOptional()
  @IsArray()
  @Type(() => CategoryYoutubeDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    description: 'Category youtubes',
    type: () => CategoryYoutubeDto,
  })
  categoryYoutubes: CategoryYoutubeDto[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Show/hide flag',
  })
  hidden?: boolean;
}
