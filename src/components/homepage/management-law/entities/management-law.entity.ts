import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('management_laws')
export class ManagementLaw {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_management_laws_title')
  @Column({ comment: 'Management law title' })
  title: string;

  @Column({ comment: 'Management law summary', type: 'text' })
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
