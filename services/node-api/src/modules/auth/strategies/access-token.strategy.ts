import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppsConfigService, Logger, RedisService, WinstonService } from '@lib/common';
import { UsersService } from 'services/node-api/src/modules/users/users.service';
import { BaseRequest, JwtPayload } from '@lib/base';
import { RedisKey } from '@lib/common/services/redis/redis-key';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: AppsConfigService,
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
    @Logger('AccessTokenStrategy') private readonly logger: WinstonService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtConfig.accessKey,
      passReqToCallback: true,
    });
  }

  async validate(req: BaseRequest, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const cachedData = await this.redisService.get(RedisKey.TOKEN_BLACK_LIST(payload.userId));

    if (cachedData) {
      const denyListTokens: string[] = JSON.parse(cachedData);

      if (denyListTokens.includes(token)) {
        this.logger.error(`Token is in deny list`);
        throw new UnauthorizedException('Invalid token');
      }
    }

    const user = await this.userService.getUserById(payload.userId, true);

    if (!user) {
      this.logger.error(`User not found`);
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    req.userCachedData = user;
    return payload;
  }
}
