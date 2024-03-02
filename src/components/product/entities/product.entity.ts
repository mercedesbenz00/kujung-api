import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { ProductImage } from './product-image.entity';
import { ProductBlog } from './product-blog.entity';
import { ProductYoutube } from './product-youtube.entity';
import { ProductPopularity } from './product-popularity.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Product title' })
  title: string;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_level1_id' })
  category_level1: Category;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_level2_id' })
  category_level2: Category;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_level3_id' })
  category_level3: Category;

  @Column({ comment: 'Construction law', type: 'text' })
  construction_law: string;

  @Column({
    nullable: true,
    comment: 'w size',
  })
  size_w: string;

  @Column({ nullable: true, comment: 'l size' })
  size_l: string;

  @Column({ nullable: true, comment: 't size' })
  size_t: string;

  @Column({ nullable: true, comment: 'product description', type: 'text' })
  desc: string;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'color_code' })
  color_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'house_style_code' })
  house_style_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'area_space_code' })
  area_space_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'house_type_code' })
  house_type_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'family_type_code' })
  family_type_info: CommonConstant;

  @ManyToMany(() => Tag, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'product_tags',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags?: Tag[];

  @ManyToMany(() => Product, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'product_similars',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_sm_id',
      referencedColumnName: 'id',
    },
  })
  similarProducts?: Product[];

  @Column({ nullable: true, comment: 'product thumbnail url', length: 2048 })
  thumbnail_url: string;

  @Column({
    type: 'longblob',
    nullable: true,
    comment: 'product detail information',
    select: false,
  })
  detail_info: Buffer;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: ['insert', 'update', 'remove'],
  })
  productImages: ProductImage[];

  @OneToMany(() => ProductBlog, (productBlog) => productBlog.product, {
    cascade: ['insert', 'update', 'remove'],
  })
  productBlogs: ProductBlog[];

  @OneToOne(() => ProductYoutube, (productYoutube) => productYoutube.product, {
    cascade: ['insert', 'update', 'remove'],
  })
  productYoutube: ProductYoutube;

  @OneToOne(
    () => ProductPopularity,
    (productPopularity) => productPopularity.product,
    {
      cascade: [],
    },
  )
  productPopularity: ProductPopularity;

  @Column({
    nullable: true,
    comment:
      'product selected icon comma joined string. For example, "New, Best"',
  })
  selected_icons: string;

  @Column({ default: false, comment: 'product hidden flag' })
  hidden: boolean;

  @Column({ default: false, comment: 'product recommended flag' })
  recommended: boolean;

  @Column({ default: false, comment: 'product top fixed flag' })
  top_fixed: boolean;

  @Column({ type: 'int', default: 0, comment: 'product wish count' })
  wish_count: number;

  @Column({ type: 'int', default: 0, comment: 'product view count' })
  view_count: number;

  @Column({ type: 'int', default: 0, comment: 'product view point' })
  view_point: number;

  private wished: boolean;

  public get userWished(): boolean {
    return this.wished;
  }

  public set userWished(value: boolean) {
    this.wished = value;
  }

  @Column({
    nullable: true,
  })
  seq: number;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
