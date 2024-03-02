import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductYoutubeDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'product youtube id',
  })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'youtube title',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'youtube summary',
  })
  summary?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'youtube url',
  })
  url?: string;

  // @IsString()
  // @IsOptional()
  // @ApiPropertyOptional({
  //   required: false,
  //   description: 'youtube thumb url',
  // })
  // thumb_url?: string;
}
