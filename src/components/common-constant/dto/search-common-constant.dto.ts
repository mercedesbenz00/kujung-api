import { IsOptional, IsBoolean, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchCommonConstantDto extends PageOptionsDto {
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
    description: 'Display flag in main',
  })
  main_display?: boolean;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: [String],
    isArray: true,
    example: ['color', 'house_style', 'area_space'],
    description:
      'type list. {color, house_style, area_space, family_type, question_type, area_code}',
  })
  @IsArray()
  @IsString({ each: true })
  typeList: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;
}
