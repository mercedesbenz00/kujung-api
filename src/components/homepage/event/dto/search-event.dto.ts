import {
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { PageOptionsDto } from '../../../../shared/dtos';

export class SearchEventDto extends PageOptionsDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'From date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  from?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'To date. Format is YYYY-MM-DDTHH:mm:ss.sssZ',
  })
  to?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'title',
    required: false,
    description: 'query type to search: { title }',
  })
  q_type?: string = 'title';

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'enabled flag',
  })
  enabled?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(3)
  @Type(() => Number)
  @ApiProperty({
    required: false,
    description:
      'Event status query. 0: All, 1: In Progress, 2: Stand By, 3: Finished',
  })
  status?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
