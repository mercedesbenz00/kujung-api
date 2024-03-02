import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('view_logs')
@Unique(['type', 'entity_id', 'user_id'])
export class ViewLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('view-logs-type-idx')
  @Column({
    length: 45,
    comment:
      'This indicates view log entity type. For example, portfolio, product, online_house, expert_house etc',
  })
  type: string;

  @Index('view-logs-user-idx')
  @Column({ comment: 'This indicates user id' })
  user_id: number;

  @Column({
    comment:
      'This indicates entity id for specfic entity which is determined by type',
  })
  entity_id: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
