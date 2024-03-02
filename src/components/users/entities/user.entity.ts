import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index('idx_users_name')
  @Column({ comment: 'User name' })
  name: string;

  @Column({
    unique: true,
    comment: 'User id',
  })
  user_id: string;

  @Column({ comment: 'User email' })
  email: string;

  @Column()
  password?: string;

  @Column({ comment: 'Phone number', nullable: true })
  phone: string;

  @Index('idx_users_nickname')
  @Column({ comment: 'nick name' })
  nickname: string;

  @Column({
    comment: 'business user company brand',
    nullable: true,
    default: null,
  })
  brand: string;

  @Column({ comment: 'User address', nullable: true })
  addr: string;

  @Column({ comment: 'Company name', nullable: true })
  company_name: string;

  @Column({ comment: 'User sub address', nullable: true })
  addr_sub: string;

  @Column({ comment: 'User 2nd sub address', nullable: true, default: null })
  zonecode: string;

  @Column({
    comment: 'User account provider',
    length: 64,
    nullable: true,
    default: 'normal',
  })
  provider: string;

  @Column({
    comment: 'User account provider id',
    nullable: true,
    default: null,
  })
  provider_id: string;

  // @OneToOne(() => Profile)
  // @JoinColumn({ name: 'profile_id' })
  // profile: Profile;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: ['insert', 'update', 'remove'],
  })
  profile: Profile;

  @ManyToMany(() => Role, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles?: Role[];

  @Index('idx_users_account_type')
  @Column({
    comment: 'Account type. {general, business}',
    length: 20,
    nullable: true,
    default: "'general'",
  })
  account_type: string;

  @Index('idx_users_business_type')
  @Column({
    comment: 'Business type. {interior, agency_store}',
    length: 20,
    nullable: true,
    default: null,
  })
  business_type: string;

  @Column({
    comment: 'Business registration number.',
    length: 128,
    nullable: true,
    default: null,
  })
  business_reg_num: string;

  @Index('idx_users_manager_type')
  @Column({
    comment: 'Manager type. {individual, legal}',
    length: 20,
    nullable: true,
    default: null,
  })
  manager_type: string;

  @Column({
    comment: 'Company contact name',
    length: 50,
    nullable: true,
    default: null,
  })
  contact_name: string;

  @Column({
    comment: 'Company phone number',
    length: 20,
    nullable: true,
    default: null,
  })
  company_phone: string;

  @Column({
    comment: 'Company approval date',
    nullable: true,
    default: null,
  })
  approved_at?: Date;

  @Column({
    comment: 'Account point',
    unsigned: true,
    type: 'int',
    default: 0,
  })
  point?: number;

  @Index('idx_users_status')
  @Column({
    comment:
      'User status. {waiting_approval, active, idle, waiting_inactive, inactive}',
    length: 20,
    nullable: true,
    default: null,
  })
  status: string;

  @Column({ comment: 'sms receive allow flag', default: true })
  allow_sms_recv: boolean;

  @Column({ comment: 'email receive allow flag', default: true })
  allow_email_recv: boolean;

  @Column({
    comment: 'user/business inactive(exit) reason',
    length: 40,
    nullable: true,
    default: null,
  })
  inactive_reason: string;

  @Column({
    comment: 'user/business inactive(exit) reason desc',
    length: 256,
    nullable: true,
    default: null,
  })
  inactive_reason_desc: string;

  @Column({
    comment: 'User account exit date',
    nullable: true,
    default: null,
  })
  inactive_at?: Date;

  @Column({
    comment: 'flag which admin did make inactive or not',
    nullable: true,
    default: null,
  })
  inactive_by_admin: boolean;

  @Column({
    comment: 'User last login date',
    nullable: true,
    default: null,
  })
  last_login_at?: Date;

  @Column({
    comment: 'User idle start date',
    nullable: true,
    default: null,
  })
  idle_at?: Date;

  @Column({ type: 'int', default: 0, comment: 'like count' })
  like_count: number;

  private liked: boolean;

  public get userLiked(): boolean {
    return this.liked;
  }

  public set userLiked(value: boolean) {
    this.liked = value;
  }

  @Index('idx_users_created_at')
  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  //   @OneToMany(() => Book, (book) => book.user)
  //   books?: Book[];
}
