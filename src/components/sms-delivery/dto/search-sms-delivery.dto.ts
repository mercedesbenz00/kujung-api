import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { PageOptionsDto } from '../../../shared/dtos';

export class SearchSmsDeliveryDto extends PageOptionsDto {
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
    description: 'query type to search: { name | phone | content }',
  })
  q_type?: string = 'name';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    default: 'SMS',
    required: false,
    description: 'msg type to search: { SMS | MMS }',
  })
  msg_type?: string = 'SMS';

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(23)
  @Type(() => Number)
  @ApiProperty({
    required: false,
    description:
      'delivery hour. 0~23. It is hour in UTC time zone. So need to send by considering timezone.\n\
      For example, if user is in +09:00 zone, then hour = selected hour - 9',
  })
  hour?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({
    required: false,
    description: 'get total product count',
  })
  needAllCount?: boolean;
}
