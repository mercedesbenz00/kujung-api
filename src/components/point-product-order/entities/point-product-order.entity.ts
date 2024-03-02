import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { PointProduct } from '../../point-product/entities/point-product.entity';

@Entity('point_product_orders')
export class PointProductOrder {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ comment: 'requester_id' })
  // requester_id: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  // @Column({ comment: 'product_id' })
  // product_id: number;

  @ManyToOne(() => PointProduct, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  pointProduct: PointProduct;

  @Index('idx_point_product_orders_name')
  @Column({ comment: 'recipient name' })
  recipient_name: string;

  @Column({ comment: 'recipient phone number' })
  recipient_phone: string;

  @Column({ comment: 'delivery address' })
  delivery_addr: string;

  @Column({ comment: 'delivery sub address' })
  delivery_addr_sub: string;

  @Column({
    comment: 'delivery 2nd sub address',
    nullable: true,
    default: null,
  })
  delivery_zonecode: string;

  @Column({
    comment: 'delivery memo',
    nullable: true,
    default: null,
  })
  delivery_memo: string;

  @Index('idx_point_product_orders_status')
  @Column({
    comment: 'Order status. {waiting, delivered}',
    length: 20,
    nullable: true,
    default: 'waiting',
  })
  status: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
