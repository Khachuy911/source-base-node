import { BaseRepository } from '@lib/base';
import { Role } from '@lib/common/entities/role/role.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Role as RoleName } from '@lib/common/enum/role.enum';

@Injectable()
export class RolesRepository extends BaseRepository<Role> {
  constructor(private readonly dataSource: DataSource) {
    super(Role, dataSource.manager);
  }

  async findRoleByName(name: RoleName) {
    return this.getOne({
      filters: {
        name,
      },
    });
  }
}
