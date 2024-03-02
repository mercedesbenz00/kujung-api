import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { QuestionAndAnswer } from './question-and-answer.entity';

@Entity('question_images')
export class QuestionImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048 })
  image_url: string;

  @ManyToOne(
    () => QuestionAndAnswer,
    (questionAndAnswer) => questionAndAnswer.questionImages,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'question_and_answer_id' })
  questionAndAnswer: QuestionAndAnswer;
}
