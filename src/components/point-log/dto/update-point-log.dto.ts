import { PartialType } from '@nestjs/mapped-types';
import { CreatePointLogDto } from './create-point-log.dto';

export class UpdatePointLogDto extends PartialType(CreatePointLogDto) {}
