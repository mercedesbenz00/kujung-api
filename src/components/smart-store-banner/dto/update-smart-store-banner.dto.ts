import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartStoreBannerDto } from './create-smart-store-banner.dto';

export class UpdateSmartStoreBannerDto extends PartialType(
  CreateSmartStoreBannerDto,
) {}
