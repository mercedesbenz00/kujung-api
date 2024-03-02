import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointProductDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'point product name' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'summary 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'point product summary' })
  summary: string;

  @IsNumber()
  @ApiProperty({
    required: true,
    description: 'point',
  })
  point?: number;

  @IsString()
  @IsNotEmpty({ message: 'desc 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'point product description' })
  desc: string;

  @IsString()
  @IsNotEmpty({ message: 'thumb_url 마당을 입력해 주세요.' })
  @ApiProperty({
    required: false,
    description: 'thumb url',
  })
  thumb_url: string;

  @IsBoolean()
  @ApiPropertyOptional({
    required: false,
    description: 'is_bee flag',
  })
  is_bee?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'view point',
  })
  view_point?: number;
}
