import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('showroom_banners')
export class ShowroomBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'image url', length: 2048, nullable: true, default: null })
  image_url: string;

  @Column({
    comment: 'image url for mobile',
    length: 2048,
    nullable: true,
    default: null,
  })
  image_url_mobile: string;

  @Column({ comment: 'Enable/Disable flag', default: true })
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
