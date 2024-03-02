import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('main_youtubes')
export class MainYoutube {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Main youtube title' })
  title: string;

  @Column({ comment: 'Video url', length: 2048 })
  video_url: string;

  @Column({ nullable: true, comment: 'Video thumb url', length: 2048 })
  thumb_url: string;

  @Column({ default: false, comment: 'Enable/disable flag' })
  enabled: boolean;

  @Index('idx_main_youtubes_seq')
  @Column({
    comment: 'display seq',
    type: 'int',
    unsigned: true,
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
