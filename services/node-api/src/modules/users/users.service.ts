import { Logger, RedisService, WinstonService } from '@lib/common';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Role } from '@lib/common/enum/role.enum';
import { RedisHash } from '@lib/common/services/redis/redis-hash';
import { ResponseResult } from '@lib/common/utils/response-result';
import { IUpdateUserPayload } from './users.interface';
import { RolesRepository } from '../roles/roles.repository';
import { PageDto, PageOptionsDto } from 'services/node-api/src/common/paging/page.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    public readonly redisService: RedisService,
    private readonly rolesRepo: RolesRepository,
    @Logger('User') private readonly logger: WinstonService,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.getUserById(userId);

    if (!user.isActive) {
      throw new UnauthorizedException();
    }

    return ResponseResult.success(user);
  }

  async getUserById(userId: string, isInternal = false) {
    const result = await this.redisService.getOrInsert(RedisHash.USERS, `${userId}`, async () => {
      const userInfo = await this.usersRepo.findUserById(userId);

      if (!userInfo || !userInfo.isActive) {
        this.logger.error(`User ${userId} does not exist or inactive`);

        if (isInternal) {
          return null;
        }

        throw new NotFoundException();
      }

      return {
        email: userInfo.email,
        userId: userInfo.id,
        username: userInfo.username,
        role: userInfo.role.name as Role,
        isActive: userInfo.isActive,
      };
    });

    return result;
  }

  async updateUserById(userId: string, data: IUpdateUserPayload, currentUserId: string) {
    try {
      const user = await this.usersRepo.findUserById(userId);
      if (!user) {
        throw new NotFoundException();
      }
      if (userId === currentUserId && data?.isActive != null) {
        throw new BadRequestException('You cannot change your own status');
      }

      if (data?.email && data.email !== user.email) {
        const isEmailExist = await this.usersRepo.findUserByEmail(data.email);
        if (isEmailExist && !isEmailExist.isDeleted) {
          throw new BadRequestException('Email already exists');
        }
      }
      if (data?.username && data.username !== user.username) {
        const isUsernameExist = await this.usersRepo.findUserByUsername(data.username);
        if (isUsernameExist && !isUsernameExist.isDeleted) {
          throw new BadRequestException('Username already exists');
        }
      }
      let role = null;
      if (data?.role) {
        role = await this.rolesRepo.findRoleByName(data.role);
        if (!role) {
          throw new BadRequestException(`Role ${data.role} not found`);
        }
      }

      const payloadUpdate = {
        ...user,
        ...data,
        role: role || user.role,
      };
      await Promise.all([
        this.usersRepo.update(userId, payloadUpdate),
        this.redisService.delHash(RedisHash.USERS, `${userId}`),
      ]);

      return ResponseResult.success(payloadUpdate);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteUserById(currentUserId: string, userId: string) {
    try {
      const user = await this.usersRepo.findUserById(userId);

      if (!user) {
        throw new NotFoundException();
      }

      if (userId === currentUserId) {
        throw new BadRequestException('You cannot delete your own account');
      }

      const data = { isDeleted: true, isActive: false, refreshToken: null };

      await Promise.all([
        this.usersRepo.update(userId, data),
        this.redisService.delHash(RedisHash.USERS, `${userId}`),
      ]);

      return ResponseResult.success();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getAllUsers(query: PageOptionsDto) {
    try {
      const { take, order, orderBy } = query;

      const [users, count] = await this.usersRepo.findAndCount({
        select: ['id', 'email', 'username', 'isActive', 'role', 'createdAt', 'updatedAt'],
        where: { isDeleted: false },
        order: { [orderBy ? orderBy : 'createdAt']: order },
        skip: query.skip,
        take: take,
      });

      const paginateResult = new PageDto<Record<string, any>>({
        items: users,
        itemCount: count ?? 0,
        pageOptionsDto: query,
      });

      return ResponseResult.success(paginateResult);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
