import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
    description: 'An array of user ids',
    example: [1, 2, 3],
    isArray: true,
    minItems: 1,
    items: {
      type: 'number',
    },
  })
  ids: number[];

  @IsNotEmpty({ message: 'status 마당을 입력해 주세요.' })
  @IsString()
  @ApiProperty({
    required: true,
    description:
      'User status. {waiting_approval, active, idle, waiting_inactive, inactive}',
  })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Inactive reason',
  })
  inactive_reason?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Inactive reason description',
  })
  inactive_reason_desc?: string;
}
