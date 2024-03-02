import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveUserAccountDto {
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
