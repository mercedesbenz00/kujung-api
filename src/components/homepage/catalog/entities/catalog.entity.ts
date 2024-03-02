import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('catalogs')
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_catalogs_title')
  @Column({ comment: 'Catalog title' })
  title: string;

  @Column({ comment: 'Catalog summary', length: 2048 })
  summary: string;

  @Column({
    comment: 'Catalog category. {catalog, sample, look}',
    nullable: true,
    default: null,
  })
  category: string;

  @Column({
    comment: 'Catalog download file url',
    length: 2048,
    nullable: true,
    default: null,
  })
  download_file: string;

  @Column({
    comment: 'Catalog preview file url',
    length: 2048,
    nullable: true,
    default: null,
  })
  preview_file: string;

  @Column({
    comment: 'Catalog thumbnail url',
    length: 2048,
    nullable: true,
    default: null,
  })
  thumb_url: string;

  @Column({
    comment: 'Catalog mobile thumbnail url',
    nullable: true,
    length: 2048,
    default: null,
  })
  thumb_url_mobile: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
