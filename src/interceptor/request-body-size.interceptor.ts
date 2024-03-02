import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PayloadTooLargeException } from '@nestjs/common';

@Injectable()
export class RequestBodySizeInterceptor implements NestInterceptor {
  constructor(private readonly limit: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const contentLength = parseInt(request.headers['content-length'], 10);
    // console.log('contentLength', contentLength);

    if (isNaN(contentLength) || contentLength > this.limit) {
      throw new PayloadTooLargeException('요청크기가 너무 큽니다.');
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
