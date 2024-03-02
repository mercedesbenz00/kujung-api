import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('popups')
export class Popup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'popup title' })
  title: string;

  @Column({
    comment: 'target, 0: current, 1: new, 2: no transition',
    default: 0,
  })
  target: number;

  @Index('idx_popups_priority')
  @Column({
    comment: 'display priority',
    type: 'int',
    unsigned: true,
    default: 1,
  })
  priority: number;

  @Column({ comment: 'popup url', length: 2048 })
  url: string;

  @Column({
    nullable: true,
    length: 2048,
    comment: 'popup pc image thumbnail url',
  })
  thumb_url: string;

  @Column({
    nullable: true,
    length: 2048,
    comment: 'popup mobile image thumbnail url',
  })
  thumb_url_mobile: string;

  @Column({ length: 2048, comment: 'popup image url for pc' })
  image_url: string;

  @Column({ length: 2048, comment: 'popup image url for mobile' })
  image_url_mobile: string;

  @Column({ comment: 'enable/disable flag', default: true })
  enabled: boolean;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
