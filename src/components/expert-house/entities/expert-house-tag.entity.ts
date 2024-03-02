import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExpertHouse } from './expert-house.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity('expert_house_tags')
export class ExpertHouseTag {
  @PrimaryColumn({ name: 'expert_house_id' })
  expertHouseId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => ExpertHouse, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'expert_house_id', referencedColumnName: 'id' }])
  expertHouses: ExpertHouse[];

  @ManyToOne(() => Tag, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tags: Tag[];
}
