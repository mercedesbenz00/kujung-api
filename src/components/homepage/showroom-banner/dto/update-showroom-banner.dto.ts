import { PartialType } from '@nestjs/mapped-types';
import { CreateShowroomBannerDto } from './create-showroom-banner.dto';

export class UpdateShowroomBannerDto extends PartialType(
  CreateShowroomBannerDto,
) {}
