import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryYoutubeDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'category youtube id',
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
}
