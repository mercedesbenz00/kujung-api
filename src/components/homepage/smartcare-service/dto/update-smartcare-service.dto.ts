import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartcareServiceDto } from './create-smartcare-service.dto';

export class UpdateSmartcareServiceDto extends PartialType(
  CreateSmartcareServiceDto,
) {}
