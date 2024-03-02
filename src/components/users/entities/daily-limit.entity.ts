import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('daily_limits')
export class DailyLimit {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house creation count',
  })
  expert_house_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house creation count',
  })
  online_house_count: number;
}
