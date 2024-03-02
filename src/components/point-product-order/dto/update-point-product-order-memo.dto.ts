import { PartialType } from '@nestjs/mapped-types';
import { CreatePointProductOrderMemoDto } from './create-point-product-order-memo.dto';

export class UpdatePointProductOrderMemoDto extends PartialType(
  CreatePointProductOrderMemoDto,
) {}
