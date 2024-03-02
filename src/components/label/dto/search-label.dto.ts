import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchLabelDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;
}
