import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('smart_store_banners')
export class SmartStoreBanner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'smart store banner title' })
  title: string;

  @Column({ comment: 'smart store banner url' })
  address: string;

  @Column({
    nullable: true,
    length: 2048,
    comment: 'smart store pc image thumbnail url',
  })
  thumb_url: string;

  @Column({
    nullable: true,
    length: 2048,
    comment: 'smart store mobile image thumbnail url',
  })
  thumb_url_mobile: string;

  @Column({ length: 2048, comment: 'smart store image url for pc' })
  image_url: string;

  @Column({ length: 2048, comment: 'smart store image url for mobile' })
  image_url_mobile: string;

  @Column({ comment: 'enable/disable flag' })
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
