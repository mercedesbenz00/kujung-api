import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'user_id',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateAdmin(username, password);
    if (!user) {
      throw new UnauthorizedException(
        '사용자 이름 혹은 비번이 정확치 않습니다.',
      );
    }
    if (user.disabled) {
      throw new HttpException(
        '승인이 되지 않은 회원입니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
