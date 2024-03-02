import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('point_products')
export class PointProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'point product name' })
  name: string;

  @Column({
    type: 'text',
    comment: 'point product summary',
    nullable: true,
  })
  summary: string;

  @Column({
    comment: 'product point',
    unsigned: true,
    type: 'int',
    default: 0,
  })
  point?: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
    comment: 'product view point',
  })
  view_point: number;

  @Column({
    type: 'longblob',
    comment: 'point product desc',
    nullable: true,
  })
  desc: Buffer;

  @Column({
    nullable: true,
    comment: 'point product thumbnail url',
    length: 2048,
  })
  thumb_url: string;

  @Column({ default: false, comment: 'bee flag' })
  is_bee: boolean;

  @Column({
    nullable: true,
  })
  seq: number;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
