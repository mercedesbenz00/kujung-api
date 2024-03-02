import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchLikeDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'like target entity type. For example, smart_store, product, user, portfolio etc',
  })
  type?: string;
}
