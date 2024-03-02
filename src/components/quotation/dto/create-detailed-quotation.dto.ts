import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetailedQuotationImageDto } from './detailed-quotation-image.dto';

export class CreateDetailedQuotationDto {
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User name', required: true })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number', required: true })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'addr 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User address', required: true })
  @IsString()
  addr: string;

  @IsNotEmpty({ message: 'house_style_text 마당을 입력해 주세요.' })
  @IsString()
  @ApiProperty({
    description: 'house style text',
    required: true,
  })
  house_style_text: string;

  @IsNotEmpty({ message: 'area_space_text 마당을 입력해 주세요.' })
  @IsString()
  @ApiProperty({
    description: 'area space text',
    required: true,
  })
  area_space_text: string;

  @ApiProperty({ description: 'Special comment (remark)', required: false })
  @IsOptional()
  @IsString()
  remark: string;

  @ApiProperty({ description: 'Living room count', required: false })
  @IsOptional()
  @IsNumber()
  living_room_count: number;

  @ApiProperty({ description: 'Kitchen count', required: false })
  @IsOptional()
  @IsNumber()
  kitchen_count: number;

  @ApiProperty({ description: 'Room count', required: false })
  @IsOptional()
  @IsNumber()
  room_count: number;

  @IsArray()
  @Type(() => DetailedQuotationImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'DetailedQuotation images',
    type: () => DetailedQuotationImageDto,
  })
  detailedQuotationImages: DetailedQuotationImageDto[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    default: null,
    description: 'category id',
  })
  category_id: number;
}
