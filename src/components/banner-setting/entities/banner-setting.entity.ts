import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('banner_setting')
export class BannerSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    default: 4,
    comment: 'slide transition interval seconds',
  })
  interval: number;

  @Column({ comment: 'banner type. ex: main, smart-store etc', unique: true })
  banner_type: string;

  @Column({ default: false, comment: 'slide auto transition flag' })
  auto_transition: boolean;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
