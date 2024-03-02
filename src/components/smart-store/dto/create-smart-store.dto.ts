import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSmartStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'smart store product name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'address url',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb url',
  })
  thumb_url?: string;

  @IsBoolean()
  @ApiPropertyOptional({
    required: false,
    description: 'display flag',
  })
  display?: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    required: false,
    description: 'recommended flag',
  })
  recommended?: boolean;

  @IsString()
  @IsNotEmpty({ message: 'desc 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'smart store description' })
  desc: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    description: 'smart store product category',
  })
  category?: string;
}
