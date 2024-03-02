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

@Entity('online_house_popularity')
export class OnlineHousePopularity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house click count in this month',
  })
  this_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house click count in prev month',
  })
  prev_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house rank in this month',
  })
  this_month_rank: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'online house rank in prev month',
  })
  prev_month_rank: number;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
    comment: 'popularity point',
  })
  popularity_point: number;

  @OneToOne(
    () => OnlineHouse,
    (onlineHouse) => onlineHouse.onlineHousePopularity,
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
