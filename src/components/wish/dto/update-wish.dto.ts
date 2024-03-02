import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {}
