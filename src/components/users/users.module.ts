import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MemoService } from './memo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { DailyLimit } from './entities/daily-limit.entity';
import { ProfileCommonConstant } from './entities/profile-common-constant.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { UserMemo } from './entities/user-memo.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Like } from '../like/entities/like.entity';
import { ResetPasswordToken } from './entities/reset-password-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      DailyLimit,
      Role,
      UserRole,
      UserMemo,
      Admin,
      ProfileCommonConstant,
      Like,
      ResetPasswordToken,
    ]),
  ],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService, MemoService],
})
export class UsersModule {}
