import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EntityIdDto } from '../../tag/dto/create-tag.dto';
import { ProductImageDto } from './product-image.dto';
import { ProductBlogDto } from './product-blog.dto';
import { ProductYoutubeDto } from './product-youtube.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Product title' })
  title: string;

  @IsNumber()
  @ApiProperty({
    default: null,
    description: 'category level 1 id',
  })
  category_level1_id: number;

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

  @IsString()
  @IsNotEmpty({ message: 'construction_law 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'Construction law',
  })
  construction_law?: string;

  @IsString()
  @ApiProperty({
    default: '0',
    description: 'w size',
  })
  size_w: string;

  @IsString()
  @ApiProperty({
    default: '0',
    description: 'l size',
  })
  size_l: string;

  @IsString()
  @ApiProperty({
    default: '0',
    description: 't size',
  })
  size_t: string;

  @IsString()
  @IsNotEmpty({ message: 'desc 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'Product description',
    maxLength: 1024,
  })
  desc: string;

  @IsNotEmpty({ message: 'color_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'color code from common constants',
    required: true,
  })
  color_code: number;

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
    description: 'area space code from common constants',
    required: false,
  })
  area_space_code: number;

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
    description: 'family type code from common constants',
    required: false,
  })
  family_type_code: number;

  @IsArray()
  @Type(() => EntityIdDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'Product tags',
    type: () => EntityIdDto,
  })
  tags: EntityIdDto[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'Similar product ids',
    example: [1, 2, 3],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  similarProductIds: number[];

  @IsString()
  @ApiPropertyOptional({
    required: false,
    description: 'product thumbnail url',
  })
  thumbnail_url?: string;

  @IsString()
  @IsNotEmpty({ message: 'detail_info 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'product detail information',
    maxLength: 1024,
  })
  detail_info: string;

  @IsArray()
  @Type(() => ProductImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'Product images',
    isArray: true,
    type: () => ProductImageDto,
  })
  productImages: ProductImageDto[];

  @IsOptional()
  @ArrayMaxSize(2)
  @IsArray()
  @Type(() => ProductBlogDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    description: 'Product blogs',
    maxItems: 2,
    isArray: true,
    type: () => ProductBlogDto,
  })
  productBlogs: ProductBlogDto[];

  // @IsOptional()
  // @IsObject()
  // @Type(() => ProductBlogDto)
  // @ValidateNested()
  // @ApiProperty({ required: false, description: 'Product blog data' })
  // productBlog: ProductBlogDto;

  @IsOptional()
  @IsObject()
  @Type(() => ProductYoutubeDto)
  @ValidateNested()
  @ApiProperty({ required: false, description: 'Product youtube data' })
  productYoutube: ProductYoutubeDto;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    required: false,
    description:
      'product selected icon comma joined string. For example, "New, Best"',
  })
  selected_icons: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'product hidden flag',
  })
  hidden?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'product recommended flag',
  })
  recommended?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'product top fixed flag',
  })
  top_fixed?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'view point',
  })
  view_point?: number;
}
