import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AgencyStoreImage } from './agency-store-image.entity';
import { CommonConstant } from '../../../common-constant/entities/common-constant.entity';

@Entity('agency_stores')
export class AgencyStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_agency_stores_name')
  @Column({ comment: 'Agency store name' })
  name: string;

  @Column({ comment: 'Agency store address' })
  addr: string;

  @Column({
    comment: 'Agency store sub address',
    nullable: true,
    default: null,
  })
  addr_sub: string;

  @Column({
    comment: 'Agency store 2nd sub address',
    nullable: true,
    default: null,
  })
  zonecode: string;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'area_code' })
  area_info: CommonConstant;

  @Column({ comment: 'Phone number' })
  phone: string;

  @Column({ nullable: true, type: 'text', comment: 'feature' })
  feature: string;

  @Column({ comment: 'Gold flag', default: false })
  is_gold: boolean;

  @Column({ comment: 'Opening hours', length: 2048 })
  opening_hours: string;

  @Column({ type: 'float', nullable: true, comment: 'longitude value' })
  lng: number;

  @Column({ type: 'float', nullable: true, comment: 'latitude value' })
  lat: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
    comment: 'Priority order',
  })
  priority: number;

  @Column({ comment: 'image url', length: 2048, nullable: true, default: null })
  image_url: string;

  @Column({
    comment: 'image url for mobile',
    length: 2048,
    nullable: true,
    default: null,
  })
  image_url_mobile: string;

  @OneToMany(
    () => AgencyStoreImage,
    (agencyStoreImage) => agencyStoreImage.agencyStore,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  agencyStoreImages: AgencyStoreImage[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
