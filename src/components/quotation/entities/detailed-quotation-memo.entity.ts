import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';

@Entity('detailed_quotation_memo')
export class DetailedQuotationMemo {
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
  @Column({ nullable: true, comment: 'detailed quotation id' })
  detailed_quotation_id: number;

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
