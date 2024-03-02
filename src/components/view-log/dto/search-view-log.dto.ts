import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchViewLogDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'view log target entity type. for example, product',
  })
  type?: string;
}
