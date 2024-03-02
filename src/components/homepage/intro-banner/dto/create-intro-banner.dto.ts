import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntroBannerDto {
  @IsString()
  @IsNotEmpty({ message: 'format 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Intro banner format. {video, image}' })
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
