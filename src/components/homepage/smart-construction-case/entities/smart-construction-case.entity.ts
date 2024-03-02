import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tag } from '../../../tag/entities/tag.entity';
import { Product } from '../../../product/entities/product.entity';
import { CommonConstant } from '../../../common-constant/entities/common-constant.entity';

@Entity('smart_construction_cases')
export class SmartConstructionCase {
  @PrimaryGeneratedColumn()
  id: number;

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
  @JoinColumn({ name: 'family_type_code' })
  family_type_info: CommonConstant;

  @ManyToMany(() => Tag, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'smart_construction_case_tags',
    joinColumn: {
      name: 'smart_construction_case_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags?: Tag[];

  @ManyToOne(() => Product, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index('idx_smart_construction_cases_title')
  @Column({ comment: 'title' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: 'summary' })
  summary: string;

  @Column({ comment: 'url', length: 2048, nullable: true, default: null })
  url: string;

  @Column({
    comment: 'thumb url',
    length: 2048,
    nullable: true,
    default: null,
  })
  thumb_url: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
