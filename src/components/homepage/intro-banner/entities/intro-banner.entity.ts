import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('intro_banners')
export class IntroBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Intro banner format. {video, image}' })
  format: string;

  @Column({ comment: 'video url', length: 2048, nullable: true, default: null })
  video_url: string;

  @Column({ nullable: true, length: 2048, comment: 'video thumb url' })
  thumb_url: string;

  @Column({
    nullable: true,
    length: 2048,
    comment: 'video thumb url for mobile',
  })
  thumb_url_mobile: string;

  @Column({ comment: 'image url', length: 2048, nullable: true, default: null })
  image_url: string;

  @Column({
    comment: 'image url for mobile',
    length: 2048,
    nullable: true,
    default: null,
  })
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
