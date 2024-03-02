import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { CommonConstant } from '../../common-constant/entities/common-constant.entity';

@Entity('profile_common_constants')
export class ProfileCommonConstant {
  @PrimaryColumn({ name: 'profile_id' })
  profileId: number;

  @PrimaryColumn({ name: 'common_constant_id' })
  commonConstantId: number;

  @ManyToOne(() => Profile, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'profile_id', referencedColumnName: 'id' }])
  profiles: Profile[];

  @ManyToOne(() => CommonConstant, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'common_constant_id', referencedColumnName: 'id' }])
  commonConstants: CommonConstant[];
}
