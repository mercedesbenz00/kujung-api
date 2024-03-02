import { PartialType } from '@nestjs/mapped-types';
import { CreatePointProductOrderDto } from './create-point-product-order.dto';

export class UpdatePointProductOrderDto extends PartialType(
  CreatePointProductOrderDto,
) {}
