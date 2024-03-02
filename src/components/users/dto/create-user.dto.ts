import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  IsEmail,
  ValidateNested,
  IsNotEmptyObject,
  IsDefined,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User name/Company name' })
  name: string;

  @IsNotEmpty({ message: 'user_id 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User id' })
  user_id: string;

  @IsEmail({}, { message: 'Enter a valid email adress' })
  @ApiProperty({ description: 'User email' })
  email: string;

  @IsNotEmpty({ message: 'Password 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'User password' })
  password: string;

  @IsNotEmpty({ message: 'Phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @IsNotEmpty({ message: 'Nickname 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'nick name' })
  nickname: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'address',
  })
  addr: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'sub address',
  })
  addr_sub: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'sub address 2',
  })
  zonecode: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'sms receive allow flag',
  })
  allow_sms_recv?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'email receive allow flag',
  })
  allow_email_recv?: boolean;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({
  //   required: false,
  //   description: 'user/business inactive(exit) reason',
  // })
  // inactive_reason?: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({
  //   required: false,
  //   description: 'user/business inactive(exit) reason desc',
  // })
  // inactive_reason_desc?: string;

  @IsNotEmptyObject({}, { message: 'profile 마당을 입력해 주세요.' })
  @IsDefined()
  @IsObject()
  @Type(() => ProfileDto)
  @ValidateNested()
  @ApiProperty({ required: true, description: 'profile data' })
  profile: ProfileDto;
}
