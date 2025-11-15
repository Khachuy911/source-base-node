import { BaseRepository } from '@lib/base';
import { User } from '@lib/common/entities/user/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async findUserByUsername(username: string) {
    const filters: Record<string, any> = {
      username,
    };

    return this.getOne({ filters });
  }

  async findUserById(id: string, relations?: string[]) {
    return this.getOne({
      filters: {
        id,
        isDeleted: false,
      },
      otherOptions: {
        relations,
      },
    });
  }

  async findUserByEmail(email: string) {
    const filters: Record<string, any> = {
      email,
    };

    return this.getOne({ filters });
  }

  async createUser(data: Partial<User>) {
    const newUser = this.create(data);
    await this.save(newUser);
  }
}
