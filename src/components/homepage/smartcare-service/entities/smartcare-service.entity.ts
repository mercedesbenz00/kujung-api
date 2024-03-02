import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SmartcareServiceImage } from './smartcare-service-image.entity';
import { SmartcareServiceMemo } from './smartcare-service-memo.entity';
import { User } from '../../../users/entities/user.entity';

@Entity('smartcare_services')
export class SmartcareService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ comment: 'Smartcare service known from', nullable: true })
  know_from: string;

  @Column({ comment: 'requester name', nullable: true })
  name: string;

  @Column({ comment: 'requester phone', nullable: true })
  phone: string;

  @Column({ comment: 'Smartcare service address' })
  addr: string;

  @Column({
    comment: 'Smartcare service sub address',
    nullable: true,
    default: null,
  })
  addr_sub: string;

  @Column({
    comment: 'Smartcare service 2nd sub address',
    nullable: true,
    default: null,
  })
  zonecode: string;

  @Column({ comment: 'Desired services', nullable: true })
  desired_services: string;

  @Column({ comment: 'Current floor', nullable: true })
  current_floor: string;

  @Column({ comment: 'Area range', nullable: true })
  area_range: string;

  @Column({ comment: 'Contact time', nullable: true })
  contact_time: string;

  @Column({ comment: 'Product name', nullable: true })
  product_name: string;

  @Column({
    comment: 'special note',
    type: 'text',
    nullable: true,
    default: null,
  })
  special_note: string;

  @Column({
    comment: 'process status',
    nullable: true,
    unsigned: true,
    type: 'tinyint',
    default: 1,
  })
  status?: number;

  @Column({ comment: 'quote url', length: 2048, nullable: true, default: null })
  quote_url: string;

  @OneToMany(
    () => SmartcareServiceImage,
    (smartcareServiceImage) => smartcareServiceImage.smartcareService,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  smartcareServiceImages: SmartcareServiceImage[];

  @OneToMany(
    () => SmartcareServiceMemo,
    (smartcareServiceMemo) => smartcareServiceMemo.smartcareService,
    {
      cascade: [],
    },
  )
  smartcareServiceMemos: SmartcareServiceMemo[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
