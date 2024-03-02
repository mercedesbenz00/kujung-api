import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePopupDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'popup title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'popup address' })
  url?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'target, 0: current, 1: new, 2: no transition',
  })
  target?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'display priority',
  })
  priority?: number;

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
    description: 'thumb mobile url',
  })
  thumb_url_mobile?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'mobile image url',
  })
  image_url_mobile?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Enable/Disable flag',
  })
  enabled?: boolean;
}
