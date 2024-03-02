import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { QuestionImage } from './question-image.entity';
import { AnswerImage } from './answer-image.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { User } from '../../users/entities/user.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';

@Entity('question_and_answers')
export class QuestionAndAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_question_and_answer_question_title')
  @Column({ comment: 'question title' })
  question_title: string;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'question_type_code' })
  question_type_info: CommonConstant;

  @Column({ nullable: true, type: 'text', comment: 'question content' })
  question_content: string;

  @OneToMany(
    () => QuestionImage,
    (questionImage) => questionImage.questionAndAnswer,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  questionImages: QuestionImage[];

  @OneToMany(
    () => AnswerImage,
    (answerImage) => answerImage.questionAndAnswer,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  answerImages: AnswerImage[];

  @Index('idx_question_and_answer_answer_title')
  @Column({ nullable: true, comment: 'answer title' })
  answer_title: string;

  @Column({ nullable: true, type: 'text', comment: 'answer content' })
  answer_content: string;

  @Index('idx_question_and_answer_status')
  @Column({
    type: 'int',
    default: 0,
    comment: 'status. 0: waiting, 1: completed, 2: rejected',
  })
  status: number;

  @Column({ nullable: true, comment: 'user id who requested' })
  requested_by: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'requested_by',
  })
  requester: User;

  @Column({ nullable: true, comment: 'admin id who udpated status' })
  managed_by: number;

  @ManyToOne(() => Admin, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'managed_by',
  })
  statusAdmin: Admin;

  @Index('idx_question_and_answer_requested_at')
  @Column({
    comment: 'requested date time',
    nullable: true,
    default: null,
  })
  requested_at?: Date;

  @Index('idx_question_and_answer_rejected_at')
  @Column({
    comment: 'rejected date time',
    nullable: true,
    default: null,
  })
  rejected_at?: Date;

  @Index('idx_question_and_answer_completed_at')
  @Column({
    comment: 'completed date time',
    nullable: true,
    default: null,
  })
  completed_at?: Date;

  @Column({
    comment: 'answer updated date time',
    nullable: true,
    default: null,
  })
  answer_updated_at?: Date;

  @Column({
    comment: 'answer created date time',
    nullable: true,
    default: null,
  })
  answer_created_at?: Date;

  @Column({
    comment: 'question updated date time',
    nullable: true,
    default: null,
  })
  question_updated_at?: Date;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'question_updated_by',
  })
  questionUpdatedUser: User;

  @ManyToOne(() => Admin, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'answer_updated_by',
  })
  answerUpdatedUser: Admin;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
