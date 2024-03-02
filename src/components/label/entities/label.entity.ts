import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_label_name')
  @Column({ comment: 'Label name' })
  name: string;

  @Column({ nullable: true, comment: 'image url', length: 2048 })
  image_url: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
