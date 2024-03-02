import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('interior_trends')
export class InteriorTrend {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_interior_trends_title')
  @Column({ comment: 'Interior trend title' })
  title: string;

  @Column({ comment: 'Interior trend summary', type: 'text' })
  summary: string;

  @Column({ comment: 'video url', length: 2048, nullable: true, default: null })
  video_url: string;

  @Column({ nullable: true, length: 2048, comment: 'video thumb url' })
  thumb_url: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
