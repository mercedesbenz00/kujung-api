import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { AuthService } from '../components/auth/auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const tokenArray = req.headers.authorization;
    if (tokenArray) {
      const decoded = this.authService.decodeToken(tokenArray.split(' ')[1]);
      if (decoded) {
        req.body['user'] = decoded.user;
      }
    }

    return next
      .handle()
      .pipe
      // tap(() => console.log(``)),
      ();
  }
}
