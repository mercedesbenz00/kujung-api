import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { DetailedQuotationImage } from './detailed-quotation-image.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { User } from '../../users/entities/user.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';

@Entity('detailed_quotations')
export class DetailedQuotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_detailed_quotation_name')
  @Column({ comment: 'User name' })
  name: string;

  @Column({ comment: 'Phone number' })
  phone: string;

  @Column({ comment: 'User address', length: 2048 })
  addr: string;

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

  @Column({ nullable: true, type: 'text', comment: 'house style text' })
  house_style_text: string;

  @Column({ nullable: true, type: 'text', comment: 'area space text' })
  area_space_text: string;

  @Column({ nullable: true, type: 'text', comment: 'remark' })
  remark: string;

  @Column({ type: 'tinyint', default: 0, comment: 'living room count' })
  living_room_count: number;

  @Column({ type: 'tinyint', default: 0, comment: 'Kitchen count' })
  kitchen_count: number;

  @Column({ type: 'tinyint', default: 0, comment: 'room count' })
  room_count: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(
    () => DetailedQuotationImage,
    (detailedQuotationImage) => detailedQuotationImage.detailedQuotation,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  detailedQuotationImages: DetailedQuotationImage[];

  @Index('idx_detailed_quotation_status')
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

  @Index('idx_detailed_quotation_requested_at')
  @Column({
    comment: 'requested date time',
    nullable: true,
    default: null,
  })
  requested_at?: Date;

  @Index('idx_detailed_quotation_rejected_at')
  @Column({
    comment: 'rejected date time',
    nullable: true,
    default: null,
  })
  rejected_at?: Date;

  @Index('idx_detailed_quotation_approved_at')
  @Column({
    comment: 'approved date time',
    nullable: true,
    default: null,
  })
  approved_at?: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
