import {
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { EntityIdDto } from '../../tag/dto/create-tag.dto';
import { Gender } from '../../users/dto/profile.dto';
import { Menu } from '../../menu/entities/menu.entity';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Admin name' })
  name: string;

  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User id' })
  user_id: string;

  @IsEmail({}, { message: 'Enter a valid email adress' })
  @ApiProperty({ description: 'Admin email' })
  email: string;

  @IsNotEmpty({ message: 'Password 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Admin password' })
  password: string;

  @IsNotEmpty({ message: 'Phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty({ message: 'Nickname 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'nick name' })
  nickname: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'disabled flag',
  })
  disabled?: boolean;

  @IsNotEmpty({ message: 'gender 마당을 입력해 주세요.' })
  @IsEnum(Gender)
  @ApiProperty({ description: 'User gender, {M, F}' })
  gender: Gender;

  @IsArray()
  @Type(() => EntityIdDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'Permission array. [{id: "menu_id"}, ...]',
    type: () => EntityIdDto,
  })
  permissions: EntityIdDto[];
}
