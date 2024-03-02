import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sms_codes')
export class SmsCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  code: string;

  @Column()
  expiration_date: Date;
}
