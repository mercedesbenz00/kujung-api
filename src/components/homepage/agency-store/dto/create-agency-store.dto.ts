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
import { AgencyStoreImageDto } from './agency-store-image.dto';

export class CreateAgencyStoreDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Agency store name' })
  name: string;

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

  @IsNotEmpty({ message: 'area_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'area code from common constants',
    required: true,
  })
  area_code: number;

  @ApiProperty({ description: 'feature', required: false })
  @IsOptional()
  @IsString()
  feature: string;

  @ApiProperty({ description: 'Opening hours', required: false })
  @IsOptional()
  @IsString()
  opening_hours: string;

  @ApiProperty({ description: 'Gold flag', required: false })
  @IsOptional()
  @IsBoolean()
  is_gold: boolean;

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
    description: 'mobile image url',
  })
  image_url_mobile?: string;

  @IsArray()
  @IsOptional()
  @Type(() => AgencyStoreImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'AgencyStore images',
    type: () => AgencyStoreImageDto,
  })
  agencyStoreImages: AgencyStoreImageDto[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'priority',
  })
  priority: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'longitude',
  })
  lng: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'latitude',
  })
  lat: number;
}
