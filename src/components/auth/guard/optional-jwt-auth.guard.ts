import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // handleRequest(err, user, info, context) {
  //   console.log('err', err, user, info);
  //   return user;
  // }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      if (!request?.headers?.authorization) {
        // No token provided
        return true;
      }
      await super.canActivate(context); // Perform token validation
      return true;
    } catch (err) {
      throw new UnauthorizedException('로그인을 해주세요.');
    }
  }
}
