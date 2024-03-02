import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty({ message: 'question 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'Faq question' })
  question: string;

  @IsNotEmpty({ message: 'answer 마당을 입력해 주세요.' })
  @ApiProperty({ description: 'answer' })
  answer: string;
}
