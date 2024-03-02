import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EntityIdDto } from '../../tag/dto/create-tag.dto';

export enum Gender {
  Male = 'M',
  Female = 'F',
}

export enum HouseType {
  ONE_ROOM = 'one_room',
  VILLA = 'villa',
  FLAT = 'flat',
  SINGLE_HOUSE = 'single_house',
}

export class ProfileDto {
  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({ description: 'User gender', required: false })
  gender: Gender;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'age range code from common constants',
    required: false,
  })
  age_range_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'color code from common constants',
    required: false,
  })
  color_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'area space code from common constants',
    required: false,
  })
  area_space_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'house type code from common constants',
    required: false,
  })
  house_type_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'family type code from common constants',
    required: false,
  })
  family_type_code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'interior feeling code from common constants',
    required: false,
  })
  interior_feeling_code: number;

  @IsOptional()
  @IsArray()
  @Type(() => EntityIdDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    description: 'House(Interior) styles',
    isArray: true,
    example: [{ id: 1 }],
    type: () => EntityIdDto,
  })
  house_styles: EntityIdDto[];

  @IsOptional()
  @ApiProperty({ description: 'Join reason', required: false })
  join_reason: string;

  @ApiProperty({ description: 'Main display flag', required: false })
  @IsOptional()
  @IsBoolean()
  show_private_privacy: boolean;

  @IsOptional()
  @ApiProperty({ description: 'User photo url', required: false })
  photo: string;
}
