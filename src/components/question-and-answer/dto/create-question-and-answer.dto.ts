import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionImageDto } from './question-image.dto';

export class CreateQuestionAndAnswerDto {
  @IsNotEmpty({ message: 'question title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Question title', required: true })
  @IsString()
  question_title: string;

  @IsNotEmpty({ message: 'question_type_code 마당을 입력해 주세요.' })
  @IsNumber()
  @ApiProperty({
    description: 'question type code from common constants',
    required: true,
  })
  question_type_code: number;

  @ApiProperty({ description: 'Question content', required: false })
  @IsOptional()
  @IsString()
  question_content: string;

  @IsArray()
  @Type(() => QuestionImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: true,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'Question images',
    type: () => QuestionImageDto,
  })
  questionImages: QuestionImageDto[];
}
