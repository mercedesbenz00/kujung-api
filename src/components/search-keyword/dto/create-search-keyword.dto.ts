import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SearchKeywordTypoDto } from './search-keyword-typo.dto';

export class CreateSearchKeywordDto {
  @IsNotEmpty({ message: 'Name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Search keyword name' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsArray()
  @IsOptional()
  @Type(() => SearchKeywordTypoDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    isArray: true,
    example: [{ id: 1, typos: '' }],
    description: 'SearchKeyword typos',
    type: () => SearchKeywordTypoDto,
  })
  searchKeywordTypos: SearchKeywordTypoDto[];
}
