import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DetailedQuotationImageDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'detailed quotation image id',
  })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'detailed quotation image url',
  })
  image_url?: string;
}
