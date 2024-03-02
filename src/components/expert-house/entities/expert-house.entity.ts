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
  OneToOne,
  Index,
} from 'typeorm';
import { Label } from '../../label/entities/label.entity';
import { Product } from '../../product/entities/product.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { User } from '../../users/entities/user.entity';
import { ExpertHousePopularity } from './expert-house-popularity.entity';
import { ExpertHouseLikeCount } from './expert-house-like-count.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';

@Entity('expert_houses')
export class ExpertHouse {
  @PrimaryGeneratedColumn()
  id: number;

  // -- constant mode start ---
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
  @JoinColumn({ name: 'family_type_code' })
  family_type_info: CommonConstant;

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
  @JoinColumn({ name: 'house_type_code' })
  house_type_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'area_space_code' })
  area_space_info: CommonConstant;
  // -- constant mode end ---

  @Column({ nullable: true, type: 'text', comment: 'status change reason' })
  reason: string;

  @Column({ comment: 'Main display flag', default: false })
  main_display: boolean;

  @Index('idx_expert_house_is_this_month')
  @Column({ comment: 'flag whether it is this month house', default: false })
  is_this_month: boolean;

  @Column({ type: 'int', nullable: true, comment: 'this month order' })
  this_month_order: number;

  @Column({ type: 'int', default: 0, comment: 'wish count' })
  wish_count: number;

  @Column({ type: 'int', default: 0, comment: 'like count' })
  like_count: number;

  @Column({ type: 'int', default: 0, comment: 'view count' })
  view_count: number;

  @Column({ comment: 'image url', length: 2048 })
  image_url: string;

  @Column({ nullable: true, length: 2048, comment: 'thumb url' })
  thumb_url: string;

  @Column({ nullable: true, length: 2048, comment: 'building address' })
  building_addr: string;

  @Column({ comment: 'Expert house title' })
  title: string;

  @Column({
    type: 'longblob',
    nullable: true,
    comment: 'expert house content',
    select: false,
  })
  content: Buffer;

  @ManyToMany(() => Tag, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'expert_house_tags',
    joinColumn: {
      name: 'expert_house_id',
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

  @ManyToOne(() => Label, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'label_id' })
  label: Label;

  @OneToOne(
    () => ExpertHousePopularity,
    (expertHousePopularity) => expertHousePopularity.expertHouse,
    {
      cascade: [],
    },
  )
  expertHousePopularity: ExpertHousePopularity;

  @OneToOne(
    () => ExpertHouseLikeCount,
    (expertHouseLikeCount) => expertHouseLikeCount.expertHouse,
    {
      cascade: [],
    },
  )
  expertHouseLikeCount: ExpertHouseLikeCount;

  @Index('idx_expert_house_status')
  @Column({
    type: 'int',
    default: 0,
    comment: 'status. 0: waiting, 1: approved, 2: rejected',
  })
  status: number;

  @Column({ nullable: true, comment: 'user id who requested' })
  requested_by: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'requested_by',
  })
  requester: User;

  @Column({ nullable: true, comment: 'admin id who udpated status' })
  managed_by: number;

  @ManyToOne(() => Admin, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'managed_by',
  })
  statusAdmin: Admin;

  @Index('idx_expert_house_requested_at')
  @Column({
    comment: 'requested date time',
    nullable: true,
    default: null,
  })
  requested_at?: Date;

  @Index('idx_expert_house_rejected_at')
  @Column({
    comment: 'rejected date time',
    nullable: true,
    default: null,
  })
  rejected_at?: Date;

  @Index('idx_expert_house_approved_at')
  @Column({
    comment: 'approved date time',
    nullable: true,
    default: null,
  })
  approved_at?: Date;

  private liked: boolean;

  public get userLiked(): boolean {
    return this.liked;
  }

  public set userLiked(value: boolean) {
    this.liked = value;
  }

  private wished: boolean;

  public get userWished(): boolean {
    return this.wished;
  }

  public set userWished(value: boolean) {
    this.wished = value;
  }

  @Column({ type: 'int', default: 0, comment: 'view point' })
  view_point: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
