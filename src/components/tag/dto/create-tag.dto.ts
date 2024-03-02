import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Tag name' })
  name: string;

  @IsNumber()
  @ApiPropertyOptional({
    required: false,
    default: 0,
    description: 'priority',
  })
  priority?: number = 0;

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
    description: 'Main Display flag',
  })
  main_display?: boolean = false;
}

export class EntityIdDto {
  @IsNumber()
  @ApiProperty({ description: 'Entity id' })
  id: number;
}

export class EntityIdArrayDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: [Number],
    description: 'An array of entity ids',
    example: [1, 2, 3],
    isArray: true,
    minItems: 1,
    items: {
      type: 'number',
    },
  })
  ids: number[];
}
