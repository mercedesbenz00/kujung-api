import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommonConstantDto {
  @IsString()
  @IsNotEmpty({ message: 'name 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Common constant name' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'type 마당을 입력해 주세요.' })
  @ApiProperty({
    description:
      'Common constant type. { color, house_style, area_space, family_type, question_type, certification_type, age_range, house_type, interior_feeling }',
  })
  type: string;

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
