import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchPointProductOrderMemoDto extends PageOptionsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'point_product_order_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'point product order id',
  })
  point_product_order_id: number;
}
