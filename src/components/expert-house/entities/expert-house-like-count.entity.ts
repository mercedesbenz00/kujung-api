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

@Entity('expert_house_like_count')
export class ExpertHouseLikeCount {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house like count in this month',
  })
  this_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'expert house like count in prev month',
  })
  prev_month_count: number;

  @OneToOne(
    () => ExpertHouse,
    (expertHouse) => expertHouse.expertHouseLikeCount,
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
