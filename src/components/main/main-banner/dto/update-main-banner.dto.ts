import { PartialType } from '@nestjs/mapped-types';
import { CreateMainBannerDto } from './create-main-banner.dto';

export class UpdateMainBannerDto extends PartialType(CreateMainBannerDto) {}
