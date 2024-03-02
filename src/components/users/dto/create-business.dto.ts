import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class CreateBusinessDto extends OmitType(CreateUserDto, [
  'phone',
  'name',
  'nickname',
]) {
  @IsNotEmpty({ message: 'business_type 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Business type. {interior, agency_store}' })
  business_type: string;

  @IsNotEmpty({ message: 'business_reg_num 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Business registration number' })
  business_reg_num: string;

  @IsNotEmpty({ message: 'manager_type 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Manager type. {individual, legal}' })
  manager_type: string;

  @IsNotEmpty({ message: 'contact_name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Company contact name' })
  contact_name: string;

  @IsNotEmpty({ message: 'company_phone 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Company phone number' })
  company_phone: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'business user company brand',
  })
  brand: string;

  @IsNotEmpty({ message: 'company_name 마당을 입력해 주세요.' })
  @ApiProperty({
    description: 'business user company name',
  })
  company_name: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Phone number',
  })
  phone: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'name',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'nick name',
  })
  nickname: string;
}
