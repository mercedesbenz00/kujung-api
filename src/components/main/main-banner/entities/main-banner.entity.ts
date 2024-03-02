import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('main_banners')
export class MainBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Main banner title' })
  title: string;

  @Column({ comment: 'Main banner address' })
  address: string;

  @Column({ comment: 'target, 0: current, 1: new, 2: no transition' })
  target: number;

  @Column({ comment: 'Main banner format. {video, image}' })
  format: string;

  @Column({ comment: 'video url' })
  video_url: string;

  @Column({ nullable: true, length: 2048, comment: 'video thumb url' })
  thumb_url: string;

  @Column({
    nullable: true,
    length: 2048,
    comment: 'video thumb url for mobile',
  })
  thumb_url_mobile: string;

  @Column({ comment: 'image url', length: 2048 })
  image_url: string;

  @Column({ comment: 'image url for mobile', length: 2048 })
  image_url_mobile: string;

  @Column({ comment: 'Enable/Disable flag' })
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
