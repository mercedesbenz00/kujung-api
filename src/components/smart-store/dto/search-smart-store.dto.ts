import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchSmartStoreDto extends PageOptionsDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'Display flag',
  })
  display?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'recommended flag',
  })
  recommended?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'category',
  })
  category?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'get total product count',
  })
  needAllCount?: boolean;
}
