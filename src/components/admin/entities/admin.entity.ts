import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Menu } from '../../menu/entities/menu.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ comment: 'Admin name' })
  name: string;

  @Column({ comment: 'Admin email' })
  email: string;

  @Column({
    unique: true,
    comment: 'admin id',
  })
  user_id: string;

  @Column()
  password?: string;

  @Column({ comment: 'Phone number' })
  phone: string;

  @Column({ comment: 'Enable/Disable flag', default: false })
  disabled: boolean;

  @Column({ comment: 'User gender. M, W', default: 'M' })
  gender: string;

  @Column({ comment: 'Nick name' })
  nickname: string;

  @ManyToMany(() => Menu, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'admin_menus',
    joinColumn: {
      name: 'admin_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'menu_id',
      referencedColumnName: 'id',
    },
  })
  permissions?: Menu[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
