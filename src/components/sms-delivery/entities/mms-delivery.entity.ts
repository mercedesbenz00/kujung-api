import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('mms_delivery')
export class MmsDelivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_mms_delivery_name')
  @Column({ comment: 'recipient name' })
  name: string;

  @Index('idx_mms_delivery_nickname')
  @Column({ comment: 'recipient nickname' })
  nickname: string;

  @Index('idx_mms_delivery_phone')
  @Column({ comment: 'recipient phone' })
  phone: string;

  @Column({
    comment: 'content',
    type: 'text',
    nullable: true,
    default: null,
  })
  content: string;

  @Column({
    comment: 'sent date time',
    nullable: true,
    default: null,
  })
  sent_at?: Date;

  @Column({
    comment: 'delivery status, 0: in progress, 1: success, 2: failure',
    default: 0,
  })
  status: number;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @Index('idx_mms_delivery_updated_at')
  @UpdateDateColumn()
  updated_at?: Date;
}
