import { PartialType } from '@nestjs/mapped-types';
import { CreateMemoDto } from './create-memo.dto';

export class UpdateMemoDto extends PartialType(CreateMemoDto) {}
