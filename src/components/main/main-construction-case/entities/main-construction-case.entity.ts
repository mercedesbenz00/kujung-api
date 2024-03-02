import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('main_construction_cases')
export class MainConstructionCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Main construction case title' })
  title: string;

  @Column({ comment: 'url', length: 2048 })
  url: string;

  @Column({ nullable: true, length: 2048, comment: 'instagram thumb url' })
  thumb_url: string;

  @Column({ default: false, comment: 'Enable/disable flag' })
  enabled: boolean;

  @Index('idx_main_construction_cases_seq')
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
