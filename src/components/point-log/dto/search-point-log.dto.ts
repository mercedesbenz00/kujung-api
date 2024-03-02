import {
  IsOptional,
  IsBoolean,
  IsNumber,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchPointLogDto extends PageOptionsDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'is_direct flag',
  })
  is_direct?: boolean;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'user id',
  })
  user_id?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: [String],
    isArray: true,
    example: ['direct', 'order', 'account'],
    description: 'type list. {direct, order, account}',
  })
  @IsArray()
  @IsString({ each: true })
  typeList: string[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
