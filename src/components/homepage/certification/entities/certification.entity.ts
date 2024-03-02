import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CommonConstant } from '../../../common-constant/entities/common-constant.entity';

@Entity('certifications')
export class Certification {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_certifications_title')
  @Column({ comment: 'Certification title' })
  title: string;

  @Index('idx_certifications_variety')
  @Column({ comment: 'Certification variety' })
  variety: string;

  @Index('idx_certifications_product_name')
  @Column({
    comment: 'Certification product name',
  })
  product_name: string;

  @Column({
    comment: 'Certification authority',
  })
  authority: string;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'certification_type_code' })
  certification_type_info: CommonConstant;

  @Column({
    comment: 'Certification attachment file',
    length: 2048,
    nullable: true,
    default: null,
  })
  attachment_file: string;

  @Column({ comment: 'thumb url', length: 2048, nullable: true, default: null })
  thumb_url: string;

  @Column({
    comment: 'thumb url for mobile',
    length: 2048,
    nullable: true,
    default: null,
  })
  thumb_url_mobile: string;

  @Column({
    comment: 'start date time',
    nullable: true,
    default: null,
  })
  start_at?: Date;

  @Column({
    comment: 'end date time',
    nullable: true,
    default: null,
  })
  end_at?: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
