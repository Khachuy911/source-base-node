import { AppsConfigService, Logger, RedisService, WinstonService } from '@lib/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { ILoginPayload, IRegisterPayload } from './auth.interface';
import { Request } from 'express';
import { ResponseResult } from '@lib/common/utils/response-result';
import { User } from '@lib/common/entities/user/user.entity';
import { compareHash, hashData } from '@lib/common/utils/hash';
import { ErrorMessageFields } from 'services/node-api/src/shared/messages/messages.enum';
import { RolesRepository } from '../roles/roles.repository';
import { RedisHash } from '@lib/common/services/redis/redis-hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AppsConfigService,
    private readonly usersRepo: UsersRepository,
    private readonly rolesRepo: RolesRepository,
    private readonly redisService: RedisService,
    @Logger('Auth') private readonly logger: WinstonService,
  ) {}

  private async genTokens(userInfo: User) {
    const payload = {
      email: userInfo.email,
      userId: userInfo.id,
      username: userInfo.username,
      role: userInfo.role.name,
    };

    const jwtInfo = this.configService.jwtConfig;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtInfo.accessKey,
        expiresIn: jwtInfo.accessExpTime,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtInfo.refreshKey,
        expiresIn: jwtInfo.refreshExpTime,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(req: Request, data: ILoginPayload) {
    const { userInfo } = await this.validateLoginInfo(req, data);

    const { accessToken, refreshToken } = await this.genTokens(userInfo);

    const hashRefreshToken = await hashData(refreshToken);

    await this.usersRepo.update(
      { username: data.username },
      {
        refreshToken: hashRefreshToken,
      },
    );

    const result = {
      is2FA: false,
      accessToken,
      refreshToken,
      userInfo: {
        email: userInfo.email,
        userId: userInfo.id,
        username: userInfo.username,
        role: userInfo.role.name,
      },
    };

    return ResponseResult.success(result);
  }

  private async validatePassword(password: string, userInfo: User) {
    const { password: currPass, id: userId } = userInfo;

    if (!(await compareHash(password, currPass))) {
      this.logger.error(`Username or Password is incorrect. Please check again.`);
      throw new UnauthorizedException(
        ErrorMessageFields.Login.InvalidInfo,
      );
    }
  }

  async validateLoginInfo(req: Request, data: ILoginPayload) {
    const { username, password } = data;

    const userInfo = await this.usersRepo.findUserByUsername(username);

    if (!userInfo || !userInfo.isActive) {
      this.logger.error(`Username ${username} not found or not active`);

      throw new UnauthorizedException(
        ErrorMessageFields.Login.InvalidInfo,
      );
    }

    await this.validatePassword(password, userInfo);

    return { userInfo };
  }

  async register(data: IRegisterPayload) {
    try {
      const isEmailExist = await this.usersRepo.findUserByEmail(data.email);
      if (isEmailExist && !isEmailExist.isDeleted) {
        throw new BadRequestException(`Email ${data.email} already exists`);
      }

      const isUsernameExist = await this.usersRepo.findUserByUsername(data.username);
      if (isUsernameExist && !isUsernameExist.isDeleted) {
        throw new BadRequestException(`Username ${data.username} already exists`);
      }

      if (!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/g)) {
        throw new BadRequestException(
          `Password must include digit, lowercase, uppercase, special char, & be at least 8 characters long`,
        );
      }

      if (data.password !== data.confirmPassword) {
        throw new BadRequestException('Password not match');
      }

      const role = await this.rolesRepo.findRoleByName(data.role);
      if (!role) {
        throw new BadRequestException(`Role ${data.role} not found`);
      }

      const userData = {
        email: data.email,
        password: data.password,
        username: data.username,
        role,
        isDeleted: false,
        isActive: true,
      };

      if (isEmailExist && isEmailExist.isDeleted) {
        userData.password = await hashData(data.password);
        await this.usersRepo.update(isEmailExist.id, userData);
      } else if (isUsernameExist && isUsernameExist.isDeleted) {
        userData.password = await hashData(data.password);
        await this.usersRepo.update(isUsernameExist.id, userData);
      } else {
        await this.usersRepo.createUser(userData);
      }

      return ResponseResult.success();
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      await Promise.all([
        this.usersRepo.update({ id: userId }, { refreshToken: null }),
        this.redisService.delHash(RedisHash.USERS, `${userId}`),
      ]);

      return ResponseResult.success({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async refreshToken(req: Request, userId: string, refreshToken: string) {
    const userInfo = await this.usersRepo.findUserById(userId);

    if (!userInfo || !userInfo.isActive) {
      this.logger.error(`User ${userId} not found or not active`);
      throw new UnauthorizedException(`Invalid info`);
    }

    if (!userInfo.refreshToken) {
      this.logger.error(`User ${userId} not found or not have refresh token`);
      throw new UnauthorizedException('Invalid info');
    }

    if (!(await compareHash(refreshToken, userInfo.refreshToken))) {
      this.logger.error(`User ${userId} has invalid refresh token`);
      throw new UnauthorizedException('Invalid info');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.genTokens(userInfo);
    const hashRefreshToken = await hashData(newRefreshToken);

    await this.usersRepo.update(
      { id: userId },
      {
        refreshToken: hashRefreshToken,
      },
    );

    const result = {
      accessToken,
      refreshToken: newRefreshToken,
    };

    return ResponseResult.success(result);
  }
}
