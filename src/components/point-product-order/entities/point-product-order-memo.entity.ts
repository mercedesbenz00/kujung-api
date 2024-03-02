import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { PointProductOrder } from './point-product-order.entity';
import { Admin } from '../../admin/entities/admin.entity';

@Entity('point_product_order_memo')
export class PointProductOrderMemo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true, comment: 'memo content' })
  content: string;

  // @ManyToOne(() => User, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'NO ACTION',
  // })
  // @JoinColumn({ name: 'user_id' })
  // user: User;
  @Column({ nullable: true, comment: 'point product order id' })
  point_product_order_id: number;

  @ManyToOne(() => Admin, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'created_by' })
  creator: Admin;

  @ManyToOne(() => Admin, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'updated_by' })
  modifier: Admin;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
