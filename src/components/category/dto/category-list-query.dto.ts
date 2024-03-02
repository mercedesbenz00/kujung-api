import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../shared/dtos';

export class CategoryListQueryDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly parentId?: number = null;
}
