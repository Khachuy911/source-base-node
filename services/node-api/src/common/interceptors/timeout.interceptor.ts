// timeout.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AppsConfigService } from '@lib/common';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutMs: number;
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: AppsConfigService,
  ) {
    // TODO: Don't understand why the timeout is always doubled.Temporarily:  timeoutMs/2
    this.timeoutMs = configService.appConfig.apiTimeoutMs || 600000; // Set the default timeout duration
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const specificTimeout = this.reflector.get('request-timeout', context.getHandler());
    return next.handle().pipe(
      timeout({
        each: specificTimeout ? specificTimeout : this.timeoutMs,
      }),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          return throwError(() => new RequestTimeoutException('API request timed out'));
        }
        return throwError(() => err);
      }),
    );
  }
}
