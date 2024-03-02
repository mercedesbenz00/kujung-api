import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailedQuotationDto } from './create-detailed-quotation.dto';

export class UpdateDetailedQuotationDto extends PartialType(
  CreateDetailedQuotationDto,
) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'Quotation status. 0: waiting, 1: approved, 2: rejected. Only admin can send this rquest',
    required: false,
  })
  status: number;
}
