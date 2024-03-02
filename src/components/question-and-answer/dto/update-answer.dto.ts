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
import { AnswerImageDto } from './answer-image.dto';

export class UpdateAnswerDto {
  @IsNotEmpty({ message: 'answer title 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Answer title', required: true })
  @IsString()
  answer_title: string;

  @ApiProperty({ description: 'Answer content', required: false })
  @IsOptional()
  @IsString()
  answer_content: string;

  @IsOptional()
  @IsArray()
  @Type(() => AnswerImageDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    required: false,
    isArray: true,
    example: [{ id: 1, image_url: '' }],
    description: 'Answer images',
    type: () => AnswerImageDto,
  })
  answerImages: AnswerImageDto[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'question and answer status. 0: waiting, 1: completed, 2: rejected. Only admin can send this rquest',
    required: false,
  })
  status: number;
}
