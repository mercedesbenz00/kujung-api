import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
@Entity('menus_tree')
@Tree('closure-table')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  children: Menu[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Menu;

  @Column({
    nullable: true,
  })
  parentId: number;

  @Column({
    nullable: true,
  })
  seq: number;

  @Column({ type: 'text' })
  desc: string;

  @Column({ default: false })
  hidden: boolean;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
