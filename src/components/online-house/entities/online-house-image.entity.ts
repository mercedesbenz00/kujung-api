import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { OnlineHouse } from './online-house.entity';

@Entity('online_house_images')
export class OnlineHouseImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048 })
  image_url: string;

  @ManyToOne(
    () => OnlineHouse,
    (onlineHouse) => onlineHouse.onlineHouseImages,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'online_house_id' })
  onlineHouse: OnlineHouse;
}
