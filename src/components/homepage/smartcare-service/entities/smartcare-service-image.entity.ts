import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { SmartcareService } from './smartcare-service.entity';

@Entity('smartcare_service_images')
export class SmartcareServiceImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048 })
  image_url: string;

  @ManyToOne(
    () => SmartcareService,
    (smartcareService) => smartcareService.smartcareServiceImages,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'smartcare_service_id' })
  smartcareService: SmartcareService;
}
