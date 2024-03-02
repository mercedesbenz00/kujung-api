import { PartialType } from '@nestjs/mapped-types';
import { CreateSmartStoreDto } from './create-smart-store.dto';

export class UpdateSmartStoreDto extends PartialType(CreateSmartStoreDto) {}
