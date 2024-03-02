import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PortfolioImage } from './portfolio-image.entity';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_portfolios_title')
  @Column({ comment: 'Portfolio title' })
  title: string;

  @Column({ comment: 'Portfolio summary', length: 2048 })
  summary: string;

  @Column({ comment: 'Portfolio content', type: 'text' })
  content: string;

  @Column({
    comment: 'Portfolio category. {brand, convention, artist}',
    nullable: true,
    default: null,
  })
  category: string;

  @Column({
    comment: 'Portfolio collaboration',
    nullable: true,
    default: null,
  })
  collaboration: string;

  @Column({
    comment: 'Portfolio place',
    length: 2048,
    nullable: true,
    default: null,
  })
  place: string;

  @Column({
    comment: 'Portfolio online info',
    length: 2048,
    nullable: true,
    default: null,
  })
  online_info: string;

  @OneToMany(
    () => PortfolioImage,
    (portfolioImage) => portfolioImage.portfolio,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  portfolioImages: PortfolioImage[];

  @Column({
    comment: 'start date time',
    nullable: true,
    default: null,
  })
  start_at?: Date;

  @Column({
    comment: 'end date time',
    nullable: true,
    default: null,
  })
  end_at?: Date;

  @Column({ type: 'int', default: 0, comment: 'like count' })
  like_count: number;

  @Column({ type: 'int', default: 0, comment: 'view count' })
  view_count: number;

  private liked: boolean;

  public get userLiked(): boolean {
    return this.liked;
  }

  public set userLiked(value: boolean) {
    this.liked = value;
  }

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
