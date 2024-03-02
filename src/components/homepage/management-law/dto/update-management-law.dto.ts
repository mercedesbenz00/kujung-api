import { PartialType } from '@nestjs/mapped-types';
import { CreateManagementLawDto } from './create-management-law.dto';

export class UpdateManagementLawDto extends PartialType(
  CreateManagementLawDto,
) {}
