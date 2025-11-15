import { Logger, WinstonService } from '@lib/common';
import { Role } from '@lib/common/enum/role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(
    @Logger('IdentityGuard') private readonly logger: WinstonService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const identity = this.reflector.get<{ roles?: Role[] }[]>('identity', context.getHandler());

    if (!identity.length) {
      return true;
    }
    const identityList = identity.map((item) => item.roles).flat();
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const role: Role = user['role'];

    if (identityList.includes(role)) {
      return true;
    }

    this.logger.error(`Role ${role} forbidden on this resource`);

    return false;
  }
}
