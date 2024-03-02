import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Menu title' })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: null,
    description: 'Parent menu id',
  })
  parentId?: number;

  @IsString()
  @IsNotEmpty({ message: 'desc 마당을 입력해 주세요.' })
  @ApiProperty({
    required: true,
    description: 'description',
  })
  desc?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Show/hide flag',
  })
  hidden?: boolean;
}
