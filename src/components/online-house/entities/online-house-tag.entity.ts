import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OnlineHouse } from './online-house.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity('online_house_tags')
export class OnlineHouseTag {
  @PrimaryColumn({ name: 'online_house_id' })
  onlineHouseId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => OnlineHouse, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'online_house_id', referencedColumnName: 'id' }])
  onlineHouses: OnlineHouse[];

  @ManyToOne(() => Tag, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  tags: Tag[];
}
