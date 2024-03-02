import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SearchTermType {
  Recommend = 'recommend',
  Popular = 'popular',
}

export class CreateSearchTermDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'SearchTerm name' })
  name: string;

  @IsNumber()
  @ApiPropertyOptional({
    required: false,
    default: 0,
    description: 'priority',
  })
  priority?: number = 0;

  @IsOptional()
  @IsEnum(SearchTermType)
  @ApiProperty({
    description: 'Search term type {recommend, popular}',
    required: false,
  })
  type?: SearchTermType;

  @IsBoolean()
  @ApiPropertyOptional({
    default: true,
    required: false,
    description: 'Display flag',
  })
  display?: boolean = true;

  @IsBoolean()
  @ApiPropertyOptional({
    default: false,
    required: false,
    description: 'Main display flag',
  })
  main_display?: boolean = false;
}
