import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admin/admin.module';
import { SmsDeliveryModule } from '../sms-delivery/sms-delivery.module';
import { PointLogModule } from '../point-log/point-log.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AdminLocalStrategy } from './strategy/admin-local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { jwtConstants } from './constant';

@Module({
  imports: [
    UsersModule,
    AdminModule,
    PointLogModule,
    PassportModule,
    SmsDeliveryModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    HttpModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminLocalStrategy,
    KakaoStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
