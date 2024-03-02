import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductImageDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'product image id',
  })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'product image url',
  })
  image_url?: string;
}
