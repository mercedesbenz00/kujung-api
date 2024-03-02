import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_popularity')
export class ProductPopularity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'product click count in this month',
  })
  this_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'product click count in prev month',
  })
  prev_month_count: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'product rank in this month',
  })
  this_month_rank: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'product rank in prev month',
  })
  prev_month_rank: number;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
    comment: 'popularity point',
  })
  popularity_point: number;

  @OneToOne(() => Product, (product) => product.productPopularity, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'entity_id' })
  product: Product;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
