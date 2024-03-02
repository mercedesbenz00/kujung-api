import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../../shared/dtos';

export class SearchSmartcareServiceDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'updated_at',
    required: false,
    description: 'date type to search: { updated_at | created_at }',
  })
  date_type?: string = 'updated_at';

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
    description: 'query type to search: { name, product_name, addr }',
  })
  q_type?: string = 'name';

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'requester id',
  })
  requester_id?: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({
    required: false,
    type: [Number],
    description: 'process status list',
    example: [1, 2, 3, 4, 5],
    isArray: true,
    items: {
      type: 'number',
    },
  })
  status_list?: number[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
