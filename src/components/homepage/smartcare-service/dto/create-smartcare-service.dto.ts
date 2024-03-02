import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SmartcareServiceImageDto } from './smartcare-service-image.dto';

export class CreateSmartcareServiceDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Smartcare service name' })
  name: string;

  @IsNotEmpty({ message: 'phone 마당을 입력해 주세요.' })
  @ApiProperty({
    description:
      'infomration source which known from. ex.{ blog_sns, search, agency_intro, surrounding_intro, other }',
  })
  know_from: string;

  @IsNotEmpty({ message: 'phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty({ message: 'addr 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'address' })
  addr: string;

  @ApiProperty({ description: 'sub address', required: false })
  @IsOptional()
  @IsString()
  addr_sub: string;

  @ApiProperty({ description: 'sub address 2', required: false })
  @IsOptional()
  zonecode: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: [String],
    isArray: true,
    example: ['smart_care1', 'smart_care2', 'other'],
    description: 'desired services. { smart_care1, smart_care2, other }',
  })
  @IsArray()
  @IsString({ each: true })
  desired_services: string[];

  @ApiProperty({
    description: 'Current floor. {papered_floor, floor, tile, unknown}',
    required: false,
  })
  @IsOptional()
  @IsString()
  current_floor: string;

  @ApiProperty({
    description: 'Area range. {10, 20, 30, 40, 50, 60, other}',
    required: false,
  })
  @IsOptional()
  @IsString()
  area_range: string;

  @ApiProperty({
    description: 'Contact available time range. {am, pm}',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact_time: string;

  @IsArray()
  @IsOptional()
  @Type(() => SmartcareServiceImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'SmartcareService images',
    type: () => SmartcareServiceImageDto,
  })
  smartcareServiceImages: SmartcareServiceImageDto[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'requester id',
  })
  requester_id?: number;

  @IsString()
  @ApiProperty({ description: 'special note', required: false })
  @IsOptional()
  special_note?: string;

  @IsString()
  @ApiProperty({ description: 'Product name', required: false })
  @IsOptional()
  product_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'quote url',
  })
  quote_url?: string;
}
