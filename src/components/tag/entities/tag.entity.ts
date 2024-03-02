import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Tag name' })
  name: string;

  @Column({ comment: 'Tag priority' })
  priority: number;

  @Column({ comment: 'Tag display flag' })
  display: boolean;

  @Column({ comment: 'Main display flag' })
  main_display: boolean;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
