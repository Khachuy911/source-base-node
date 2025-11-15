import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import requestIp from 'request-ip';
import { Logger, WinstonService } from '@lib/common';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly cls: ClsService,
    @Logger('Request-info') private readonly logger: WinstonService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    this.logger.info(``, {
      method: req.method,
      url: req.url,
      header: JSON.stringify(req.headers),
      ip: requestIp.getClientIp(req),
      port: req.headers['x-forwarded-port'] || req.socket.localPort,
      host: req.headers.host,
      //referer: req.headers.referer || req.headers.referrer,
      httpVersion: req.httpVersionMajor + '.' + req.httpVersionMinor,
      //userAgent: req.headers['user-agent'],
      params: req.params ? JSON.stringify(req.params) : null,
      query: req.query ? JSON.stringify(req.query) : null,
      body: req.body ? JSON.stringify(req.body) : null,
    });

    return next.handle();
  }
}
