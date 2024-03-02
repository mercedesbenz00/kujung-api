import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class QuerySimilarProductDto extends PageOptionsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'product id to get similar products with',
  })
  id?: number;
}
