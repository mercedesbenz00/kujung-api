import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDetailedQuotationMemoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'memo content',
  })
  content?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'detailed_quotation_id 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'detailed quotation id',
  })
  detailed_quotation_id: number;
}
