import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_blogs')
export class ProductBlog {
  @PrimaryGeneratedColumn('increment')
  id: number; // title, summary, url

  @Column({
    length: 255,
    comment: 'Blog title',
  })
  title: string;

  @Column({
    type: 'text',
    comment: 'Blog summary',
    nullable: true,
  })
  summary: string;

  @Column({ name: 'url', length: 2048, comment: 'blog url' })
  url: string;

  @Column({
    name: 'thumb_url',
    length: 2048,
    comment: 'blog thumb url',
    nullable: true,
  })
  thumb_url: string;

  @ManyToOne(() => Product, (product) => product.productBlogs, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
