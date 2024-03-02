import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_events_title')
  @Column({ comment: 'Event title' })
  title: string;

  @Column({ type: 'longblob', nullable: true, comment: 'Event content' })
  content: Buffer;

  @Index('idx_events_start_at')
  @Column({
    comment: 'start date time',
    nullable: true,
    default: null,
  })
  start_at?: Date;

  @Index('idx_events_end_at')
  @Column({
    comment: 'end date time',
    nullable: true,
    default: null,
  })
  end_at?: Date;

  @Column({
    comment: 'thumbnail url',
    length: 2048,
    nullable: true,
    default: null,
  })
  thumb_url: string;

  @Index('idx_events_enabled')
  @Column({ comment: 'Enabled flag', default: false })
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
