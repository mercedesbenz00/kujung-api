import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductBlogDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'product blog id',
  })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'blog title',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'blog summary',
  })
  summary?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'blog url',
  })
  url?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'blog thumb url',
  })
  thumb_url?: string;
}
