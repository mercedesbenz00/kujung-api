import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { DetailedQuotation } from './detailed-quotation.entity';

@Entity('detailed_quotation_images')
export class DetailedQuotationImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', length: 2048 })
  image_url: string;

  @ManyToOne(
    () => DetailedQuotation,
    (detailedQuotation) => detailedQuotation.detailedQuotationImages,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn({ name: 'detailed_quotation_id' })
  detailedQuotation: DetailedQuotation;
}
