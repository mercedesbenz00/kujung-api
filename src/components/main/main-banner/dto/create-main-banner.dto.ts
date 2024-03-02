import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMainBannerDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Main banner title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Main banner address' })
  address?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'target, 0: current, 1: new, 2: no transition',
  })
  target?: number;

  @IsString()
  @IsNotEmpty({ message: 'format 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Main banner format. {video, image}' })
  format: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'video url',
  })
  video_url?: string;

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
