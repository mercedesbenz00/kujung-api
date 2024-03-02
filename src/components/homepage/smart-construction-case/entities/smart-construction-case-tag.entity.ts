import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SmartConstructionCase } from './smart-construction-case.entity';
import { Tag } from '../../../tag/entities/tag.entity';

@Entity('smart_construction_case_tags')
export class SmartConstructionCaseTag {
  @PrimaryColumn({ name: 'smart_construction_case_id' })
  expertHouseId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => SmartConstructionCase, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'smart_construction_case_id', referencedColumnName: 'id' },
  ])
  expertHouses: SmartConstructionCase[];

  @ManyToOne(() => Tag, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tags: Tag[];
}
