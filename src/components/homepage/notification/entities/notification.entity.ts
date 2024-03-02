import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_notifications_title')
  @Column({ comment: 'Notification title' })
  title: string;

  @Column({ comment: 'Notification content', type: 'longblob' })
  content: Buffer;

  @Index('idx_notifications_top_fixed')
  @Column({ default: false, comment: 'Notification top fixed flag' })
  top_fixed: boolean;

  @Column({ type: 'int', default: 0, comment: 'like count' })
  like_count: number;

  @Column({ type: 'int', default: 0, comment: 'view count' })
  view_count: number;

  @Column({
    comment: 'Notification url',
    length: 2048,
    nullable: true,
    default: null,
  })
  url: string;

  @Column({
    comment: 'Notification thumbnail url',
    length: 2048,
    nullable: true,
    default: null,
  })
  thumb_url: string;

  @Column({
    comment: 'Notification mobile thumbnail url',
    nullable: true,
    length: 2048,
    default: null,
  })
  thumb_url_mobile: string;

  private liked: boolean;

  public get userLiked(): boolean {
    return this.liked;
  }

  public set userLiked(value: boolean) {
    this.liked = value;
  }

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
