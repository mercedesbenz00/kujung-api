import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ExpertHouse } from './expert-house.entity';

@Entity('expert_house_popularity')
export class ExpertHousePopularity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house click count in this month',
  })
  this_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house click count in prev month',
  })
  prev_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house rank in this month',
  })
  this_month_rank: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house rank in prev month',
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
    () => ExpertHouse,
    (expertHouse) => expertHouse.expertHousePopularity,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'entity_id' })
  expertHouse: ExpertHouse;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
