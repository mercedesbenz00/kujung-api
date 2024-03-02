import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductPopularityDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'product popularity id',
  })
  id?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'product click count in this month',
  })
  this_month_count?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'product click count in prev month',
  })
  prev_month_count?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'product rank in prev month',
  })
  this_month_rank?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'product rank in prev month',
  })
  prev_month_rank?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'popularity point',
  })
  popularity_point?: number;
}
