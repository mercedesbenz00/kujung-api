import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartConstructionCaseDto } from './create-smart-construction-case.dto';

export class UpdateSmartConstructionCaseDto extends PartialType(
  CreateSmartConstructionCaseDto,
) {}
