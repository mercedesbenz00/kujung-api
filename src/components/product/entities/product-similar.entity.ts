import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_similars')
export class ProductSimilar {
  @PrimaryColumn({ name: 'product_id' })
  product_id: number;

  @PrimaryColumn({ name: 'product_sm_id' })
  product_sm_id: number;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  products: Product[];

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_sm_id' })
  similarProducts: Product[];
}
