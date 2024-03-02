import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchPointProductOrderDto extends PageOptionsDto {
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
  @ApiPropertyOptional({
    default: 'pointProduct.name',
    required: false,
    description:
      'query type to search: { pointProduct.name | requester.name | requester.email | requester.phone }',
  })
  q_type?: string = 'pointProduct.name';

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Keyword',
  })
  q?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'requester id',
  })
  requester_id?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: [String],
    isArray: true,
    example: ['waiting', 'delivered'],
    description: 'delivery status. {waiting, delivered}',
  })
  @IsArray()
  @IsString({ each: true })
  statusList: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'get total count',
  })
  needAllCount?: boolean;
}
