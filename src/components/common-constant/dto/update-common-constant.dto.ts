import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonConstantDto } from './create-common-constant.dto';

export class UpdateCommonConstantDto extends PartialType(
  CreateCommonConstantDto,
) {}
