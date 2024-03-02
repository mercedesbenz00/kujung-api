import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('point_logs')
export class PointLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    comment: 'log point',
    unsigned: true,
    type: 'int',
    default: 0,
  })
  point?: number;

  @Column({
    type: 'text',
    comment: 'point memo',
    nullable: true,
  })
  memo: string;

  @Index('idx_point_logs_type')
  @Column({
    comment: 'Point log application type. { direct, order, account }',
  })
  type: string;

  @Index('idx_point_logs_is_direct')
  @Column({ default: false, comment: 'flag whether it is direct input' })
  is_direct: boolean;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
