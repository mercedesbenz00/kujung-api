import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { SearchKeyword } from './search-keyword.entity';

@Entity('search_keyword_typos')
export class SearchKeywordTypo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'typos', length: 512 })
  typos: string;

  @ManyToOne(
    () => SearchKeyword,
    (searchKeyword) => searchKeyword.searchKeywordTypos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'search_keyword_id' })
  searchKeyword: SearchKeyword;
}
