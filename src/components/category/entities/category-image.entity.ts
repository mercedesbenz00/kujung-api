import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('category_images')
export class CategoryImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048, comment: 'category image url' })
  image_url: string;

  @ManyToOne(() => Category, (category) => category.categoryImages, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
