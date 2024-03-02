import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchWishDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'wish target entity type. For example, smart_store, product etc',
  })
  type?: string;
}
