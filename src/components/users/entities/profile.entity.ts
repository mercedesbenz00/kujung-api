import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  JoinTable,
  ManyToOne,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

import { CommonConstant } from '../../common-constant/entities/common-constant.entity';

enum Gender {
  Male = 'M',
  Female = 'F',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Gender,
    comment: 'User gender. M, F',
    default: Gender.Male,
  })
  gender: Gender;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'age_range_code' })
  age_range_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'color_code' })
  color_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'area_space_code' })
  area_space_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'house_type_code' })
  house_type_info: CommonConstant;

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'family_type_code' })
  family_type_info: CommonConstant;

  @ManyToMany(() => CommonConstant, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'profile_common_constants',
    joinColumn: {
      name: 'profile_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'common_constant_id',
      referencedColumnName: 'id',
    },
  })
  house_styles?: CommonConstant[];

  @ManyToOne(() => CommonConstant, {
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'interior_feeling_code' })
  interior_feeling_info: CommonConstant;

  @Column({ nullable: true, comment: 'Join reason' })
  join_reason: string;

  @Column({ comment: 'Show private privacy', default: false })
  show_private_privacy: boolean;

  @Column({ nullable: true, comment: 'User photo' })
  photo: string;
}
