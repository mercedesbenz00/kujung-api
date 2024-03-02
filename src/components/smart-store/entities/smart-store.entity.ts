import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('smart_stores')
export class SmartStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'smart store product name' })
  name: string;

  @Column({ nullable: true, comment: 'address url', length: 2048 })
  address: string;

  @Column({ nullable: true, comment: 'thumbnail url', length: 2048 })
  thumb_url: string;

  @Column({ default: false, comment: 'display flag' })
  display: boolean;

  @Column({ type: 'int', default: 0, comment: 'wish count' })
  wish_count: number;

  @Column({
    type: 'text',
    comment: 'smart store desc',
    nullable: true,
  })
  desc: string;

  @Column({ default: false, comment: 'recommended flag' })
  recommended: boolean;

  @Column({ nullable: true, comment: 'smart store product category' })
  category: string;

  private wished: boolean;

  public get userWished(): boolean {
    return this.wished;
  }

  public set userWished(value: boolean) {
    this.wished = value;
  }

  @Column({ type: 'int', default: 0, comment: 'like count' })
  like_count: number;

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
