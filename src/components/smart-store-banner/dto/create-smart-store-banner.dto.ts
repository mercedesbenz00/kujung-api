import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSmartStoreBannerDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Smart store banner title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Smart store banner address' })
  address?: string;

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
