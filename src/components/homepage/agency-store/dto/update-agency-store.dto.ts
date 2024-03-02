import { PartialType } from '@nestjs/mapped-types';
import { CreateAgencyStoreDto } from './create-agency-store.dto';

export class UpdateAgencyStoreDto extends PartialType(CreateAgencyStoreDto) {}
