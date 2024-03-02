import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { CategoryImage } from './category-image.entity';
import { CategoryYoutube } from './category-youtube.entity';

@Entity('categories_tree')
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @ManyToOne(() => Category, (category) => category.children, {
  //   nullable: true,
  // })
  // @JoinColumn([{ name: 'parentId', referencedColumnName: 'id' }])
  // parent: Category;

  // @OneToMany(() => Category, (category) => category.parent)
  // children: Category[];
  @TreeChildren()
  children: Category[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Category;

  @Column({
    nullable: true,
  })
  parentId: number;

  @Column({
    nullable: true,
  })
  seq: number;

  @Column()
  depth: number;

  @Column({
    length: 2048,
  })
  image_url: string;

  @Column({ type: 'text' })
  desc: string;

  @Column({ default: false })
  hidden: boolean;

  @OneToMany(() => CategoryImage, (categoryImage) => categoryImage.category, {
    cascade: ['insert', 'update', 'remove'],
  })
  categoryImages: CategoryImage[];

  @OneToMany(
    () => CategoryYoutube,
    (categoryYoutube) => categoryYoutube.category,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  categoryYoutubes: CategoryYoutube[];

  @Column({ nullable: true, comment: 'comma separted string' })
  tags: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
