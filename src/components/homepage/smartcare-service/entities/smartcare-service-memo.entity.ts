import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SmartcareService } from './smartcare-service.entity';
import { Admin } from '../../../admin/entities/admin.entity';

@Entity('smartcare_service_memo')
export class SmartcareServiceMemo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true, comment: 'memo content' })
  content: string;

  // @Column({ nullable: true, comment: 'smartcare service id' })
  // smartcare_service_id: number;

  @ManyToOne(
    () => SmartcareService,
    (smartcareService) => smartcareService.smartcareServiceMemos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'smartcare_service_id' })
  smartcareService: SmartcareService;

  @Column({
    comment: 'process status',
    nullable: true,
    unsigned: true,
    type: 'tinyint',
    default: 1,
  })
  status?: number;

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
