import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('like_items')
@Unique(['type', 'entity_id', 'user_id'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('like-type-idx')
  @Column({
    length: 45,
    comment:
      'This indicates like entity type. For example, notification, expert_house, online_house, portfolio etc',
  })
  type: string;

  @Index('like-user-idx')
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
