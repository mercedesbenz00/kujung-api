import { PartialType } from '@nestjs/mapped-types';
import { CreateMainInstagramDto } from './create-main-instagram.dto';

export class UpdateMainInstagramDto extends PartialType(
  CreateMainInstagramDto,
) {}
