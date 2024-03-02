import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExpertHouseDto } from './create-expert-house.dto';

export class UpdateExpertHouseDto extends PartialType(CreateExpertHouseDto) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'Expert house status. 0: waiting, 1: approved, 2: rejected. Only admin can send this rquest',
    required: false,
  })
  status: number;
}
