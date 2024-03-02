import { IsOptional, IsBoolean, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchUserDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'Account type. {general, business}',
  })
  account_type?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description: 'Manager type. {individual, legal}',
  })
  manager_type?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    required: false,
    description:
      'Account status. { waiting_approval, active, idle, waiting_inactive, inactive }',
  })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'name',
    required: false,
    description:
      'query type to search: { user_id | name | email | phone | nickname | inactive_reason }',
  })
  q_type?: string = 'name';

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
    default: 'created_at',
    required: false,
    description:
      'query date type to search: { created_at | approved_at | idle_at | inactive_at }',
  })
  date_type?: string = 'created_at';

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

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'get all count',
  })
  needAllCount?: boolean;
}
