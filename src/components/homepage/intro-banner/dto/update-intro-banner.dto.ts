import { PartialType } from '@nestjs/mapped-types';
import { CreateIntroBannerDto } from './create-intro-banner.dto';

export class UpdateIntroBannerDto extends PartialType(CreateIntroBannerDto) {}
