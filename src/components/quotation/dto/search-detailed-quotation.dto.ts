import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchDetailedQuotationDto extends PageOptionsDto {
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'Status list',
    example: [0, 1, 2],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  status_list: number[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'requested_at',
    required: false,
    description:
      'date type to search: { requested_at | rejected_at | approved_at }',
  })
  date_type?: string = 'requested_at';

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
    default: 'name',
    required: false,
    description: 'query type to search: { name | phone }',
  })
  q_type?: string = 'name';

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'requester id',
  })
  requester_id?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
