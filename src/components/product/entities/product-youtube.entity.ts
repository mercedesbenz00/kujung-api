import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_youtubes')
export class ProductYoutube {
  @PrimaryGeneratedColumn('increment')
  id: number; // title, summary, url

  @Column({
    length: 255,
    comment: 'Youtube title',
  })
  title: string;

  @Column({
    type: 'text',
    comment: 'Youtube summary',
    nullable: true,
  })
  summary: string;

  @Column({ name: 'url', length: 2048, comment: 'youtube url' })
  url: string;

  @Column({
    name: 'thumb_url',
    length: 2048,
    comment: 'youtube thumb url',
    nullable: true,
  })
  thumb_url: string;

  @OneToOne(() => Product, (product) => product.productYoutube, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
