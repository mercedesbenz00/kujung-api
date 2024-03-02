import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateCertificationDto {
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Certification name' })
  title: string;

  @IsNotEmpty({ message: 'variety 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Certification variety' })
  variety: string;

  @IsNotEmpty({ message: 'product_name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Product name' })
  product_name: string;

  @IsNotEmpty({ message: 'authority 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Certification authority' })
  authority: string;

  @IsNotEmpty({ message: 'certification_type_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'Certification type code from common constants',
    required: true,
  })
  certification_type_code: number;

  @ApiProperty({ description: 'attachment_file', required: false })
  @IsOptional()
  @IsString()
  attachment_file: string;

  @ApiProperty({ description: 'thumb_url', required: false })
  @IsOptional()
  @IsString()
  thumb_url: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb url for mobile',
  })
  thumb_url_mobile?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'start date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  start_at?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'start date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  end_at?: string;
}
