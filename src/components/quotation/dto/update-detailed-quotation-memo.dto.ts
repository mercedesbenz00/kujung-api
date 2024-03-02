import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailedQuotationMemoDto } from './create-detailed-quotation-memo.dto';

export class UpdateDetailedQuotationMemoDto extends PartialType(
  CreateDetailedQuotationMemoDto,
) {}
