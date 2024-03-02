import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OnlineHouse } from './online-house.entity';

@Entity('online_house_like_count')
export class OnlineHouseLikeCount {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house like count in this month',
  })
  this_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house like count in prev month',
  })
  prev_month_count: number;

  @OneToOne(
    () => OnlineHouse,
    (onlineHouse) => onlineHouse.onlineHouseLikeCount,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'entity_id' })
  onlineHouse: OnlineHouse;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
