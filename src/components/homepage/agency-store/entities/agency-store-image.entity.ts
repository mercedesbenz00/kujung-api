import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { AgencyStore } from './agency-store.entity';

@Entity('agency_store_images')
export class AgencyStoreImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048 })
  image_url: string;

  @ManyToOne(
    () => AgencyStore,
    (agencyStore) => agencyStore.agencyStoreImages,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'agency_store_id' })
  agencyStore: AgencyStore;
}
