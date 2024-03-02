import { PartialType } from '@nestjs/mapped-types';
import { CreateMainConstructionCaseDto } from './create-main-construction-case.dto';

export class UpdateMainConstructionCaseDto extends PartialType(
  CreateMainConstructionCaseDto,
) {}
