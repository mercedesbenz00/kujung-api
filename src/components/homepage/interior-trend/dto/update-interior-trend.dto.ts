import { PartialType } from '@nestjs/mapped-types';
import { CreateInteriorTrendDto } from './create-interior-trend.dto';

export class UpdateInteriorTrendDto extends PartialType(
  CreateInteriorTrendDto,
) {}
