import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

enum SearchTermType {
  Recommend = 'recommend',
  Popular = 'popular',
}

@Entity('search_terms')
export class SearchTerm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Search term name' })
  name: string;

  @Column({ comment: 'Priority' })
  priority: number;

  @Column({ comment: 'Display flag' })
  display: boolean;

  @Column({ comment: 'Main display flag' })
  main_display: boolean;

  @Column({ comment: 'count', default: 0 })
  count: number;

  @Column({
    type: 'enum',
    enum: SearchTermType,
    comment: 'search term type. recommend, popular',
    default: SearchTermType.Recommend,
  })
  type: SearchTermType;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
