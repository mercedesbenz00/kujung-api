import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartcareServiceMemoDto } from './create-smartcare-service-memo.dto';

export class UpdateSmartcareServiceMemoDto extends PartialType(
  CreateSmartcareServiceMemoDto,
) {}
