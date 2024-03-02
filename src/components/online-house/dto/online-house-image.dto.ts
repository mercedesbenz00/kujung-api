import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OnlineHouseImageDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'online house image id',
  })
  id?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'online house image url',
  })
  image_url?: string;
}
