import { BaseRequest } from '@lib/base';
import { Logger, WinstonService } from '@lib/common';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class BackendGuard implements CanActivate {
  constructor(
    @Logger('BackendGuard') private readonly logger: WinstonService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<BaseRequest>();
    const token = request.query.token;
    const origin = request.headers.origin;

    if (
      !token &&
      (!origin ||
        (origin &&
          (!origin.includes('hvn.mvicloud.net') || !origin.includes('office.mvicloud.net'))))
    ) {
      this.logger.error(`Origin ${origin} not have permission to call ${request.url}`);
      throw new UnauthorizedException('Not enough permission to call this API');
    }

    if (
      token &&
      token !==
        'alKUBod68OtPyF_E27tRMji4mG_vFSNKyu-cUR0s1RfOlbwjC2ezvLKz5FHmP2gqpbUl9VZOws1_9cL6HABn7g'
    ) {
      this.logger.error(`Invalid token: ${token}`);
      throw new UnauthorizedException('Not enough permission to call this API');
    }

    return true;
  }
}
