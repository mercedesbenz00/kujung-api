import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { SearchKeywordTypo } from './search-keyword-typo.entity';
@Entity('search_keywords')
export class SearchKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_search_keywords_name')
  @Column({ comment: 'Search keyword name' })
  name: string;

  @OneToMany(
    () => SearchKeywordTypo,
    (searchKeywordTypos) => searchKeywordTypos.searchKeyword,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  searchKeywordTypos: SearchKeywordTypo[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
