import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchDetailedQuotationMemoDto extends PageOptionsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'detailed_quotation_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'detailed quotation id',
  })
  detailed_quotation_id: number;
}
