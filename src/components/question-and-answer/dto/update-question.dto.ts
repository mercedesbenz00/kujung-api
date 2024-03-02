import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionAndAnswerDto } from './create-question-and-answer.dto';

export class UpdateQuestionDto extends PartialType(
  CreateQuestionAndAnswerDto,
) {}
