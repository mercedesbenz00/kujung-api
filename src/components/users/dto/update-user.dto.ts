import {
  IsOptional,
  ValidateNested,
  IsDefined,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UpdateProfileDto } from './update-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'profile',
]) {
  @IsOptional()
  @IsDefined()
  @IsObject()
  @Type(() => UpdateProfileDto)
  @ValidateNested()
  @ApiProperty({ required: true, description: 'profile data' })
  profile: UpdateProfileDto;
}
