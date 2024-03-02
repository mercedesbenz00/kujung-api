import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointProductOrderMemoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'memo content',
  })
  content?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'point_product_order_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'point product order id',
  })
  point_product_order_id: number;
}
