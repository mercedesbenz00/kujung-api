import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('category_youtubes')
export class CategoryYoutube {
  @PrimaryGeneratedColumn('increment')
  id: number; // title, summary, url

  @Column({
    length: 255,
    comment: 'Youtube title',
    nullable: true,
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

  @ManyToOne(() => Category, (category) => category.categoryYoutubes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
