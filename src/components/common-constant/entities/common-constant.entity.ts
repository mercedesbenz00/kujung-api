import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('common_constants')
export class CommonConstant {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_common_constants_name')
  @Column({ comment: 'Common constant name' })
  name: string;

  @Index('idx_common_constants_type')
  @Column({
    comment:
      'Common constant type. { color, house_style, area_space, family_type, question_type, area_code, age_range }',
  })
  type: string;

  @Column({
    comment: 'Common constant number value',
    nullable: true,
    default: null,
  })
  value_num: number;

  @Column({
    comment: 'Common constant priority',
    nullable: true,
    default: 0,
  })
  priority: number;

  @Column({ comment: 'Common constant display flag', default: true })
  display: boolean;

  @Column({ comment: 'Main display flag', default: false })
  main_display: boolean;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
