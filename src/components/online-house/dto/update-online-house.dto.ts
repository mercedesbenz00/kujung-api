import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineHouseDto } from './create-online-house.dto';

export class UpdateOnlineHouseDto extends PartialType(CreateOnlineHouseDto) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'Online house status. 0: waiting, 1: approved, 2: rejected. Only admin can send this rquest',
    required: false,
  })
  status: number;

  @ApiProperty({
    description: 'Flag whether it is this month house',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_this_month: boolean;
}
