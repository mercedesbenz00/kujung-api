import { PartialType } from '@nestjs/mapped-types';
import { CreatePointProductDto } from './create-point-product.dto';

export class UpdatePointProductDto extends PartialType(CreatePointProductDto) {}
