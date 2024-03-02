import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity('portfolio_images')
export class PortfolioImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048 })
  image_url: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioImages, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;
}
