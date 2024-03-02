import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('wish_items')
@Unique(['type', 'entity_id', 'user_id'])
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('wish-type-idx')
  @Column({
    length: 45,
    comment:
      'This indicates wish entity type. For example, smart_store, product, online_house, expert_house etc',
  })
  type: string;

  @Index('wish-user-idx')
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
