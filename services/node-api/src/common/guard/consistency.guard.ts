import { BaseRequest, JwtPayload, UserCachedData } from '@lib/base';
import { Logger, WinstonService } from '@lib/common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ConsistencyGuard implements CanActivate {
  constructor(
    @Logger('ConsistencyGuard') private readonly logger: WinstonService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<BaseRequest>();
    const user = request.user;
    const userCachedData = request.userCachedData;

    if (this.hasDiffInfo(user as JwtPayload, userCachedData)) {
      this.logger.error(`JWT payload and cached data not synced`);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  hasDiffInfo(jwtPayload: JwtPayload, cachedData: UserCachedData) {
    return (
      jwtPayload.role !== cachedData.role ||
      jwtPayload.userId !== cachedData.userId ||
      jwtPayload.username !== cachedData.username
    );
  }
}
