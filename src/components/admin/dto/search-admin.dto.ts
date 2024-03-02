import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchAdminDto extends PageOptionsDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'disabled flag',
  })
  disabled?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'name',
    required: false,
    description:
      'query type to search: { user_id | nickname | email | phone | name }',
  })
  q_type?: string = 'name';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'get all count',
  })
  needAllCount?: boolean;
}
