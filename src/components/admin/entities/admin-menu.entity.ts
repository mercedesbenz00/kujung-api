import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Admin } from './admin.entity';
import { Menu } from '../../menu/entities/menu.entity';

@Entity('admin_menus')
export class AdminMenu {
  @PrimaryColumn({ name: 'admin_id' })
  admin_id: number;

  @PrimaryColumn({ name: 'menu_id' })
  menu_id: number;

  @ManyToOne(() => Admin, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'admin_id', referencedColumnName: 'id' }])
  admins: Admin[];

  @ManyToOne(() => Menu, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'menu_id', referencedColumnName: 'id' }])
  menus: Menu[];
}
