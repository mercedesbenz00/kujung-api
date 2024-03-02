import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EntityIdDto } from '../../../tag/dto/create-tag.dto';

export class CreateSmartConstructionCaseDto {
  @IsString()
  @IsNotEmpty({ message: 'title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Smart construction case title' })
  title: string;

  @IsNotEmpty({ message: 'area_space_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'area space code from common constants',
    required: true,
  })
  area_space_code: number;

  @IsNotEmpty({ message: 'family_type_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'family type code from common constants',
    required: true,
  })
  family_type_code: number;

  @IsArray()
  @Type(() => EntityIdDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    description: 'tags',
    isArray: true,
    example: [{ id: 1 }],
    type: () => EntityIdDto,
  })
  tags: EntityIdDto[];

  @IsNotEmpty({ message: 'product_id 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    required: true,
    default: null,
    description: 'product id',
  })
  product_id: number;

  @IsString()
  @ApiProperty({ description: 'summary', required: false })
  @IsOptional()
  summary: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'url',
  })
  url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'thumb_url',
  })
  thumb_url?: string;
}
