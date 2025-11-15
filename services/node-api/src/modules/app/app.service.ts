import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppsConfigService, Logger, WinstonService } from '@lib/common';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: AppsConfigService,
    @Logger('App') private readonly logger: WinstonService,
  ) {}

  async onApplicationBootstrap() {
  }

  async initDefaultUsers() {
    try {
      const userRawSQL = `SELECT * FROM users WHERE 1=1`;
      const roleRawSQL = `SELECT * FROM roles WHERE 1=1`;

      const [userData, roleData] = await Promise.all([
        this.dataSource.query(userRawSQL),
        this.dataSource.query(roleRawSQL),
      ]);

      if (!roleData?.length) {
        const sqlFilePath = path.join(process.cwd(), 'seeders/sql/init-role.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf-8');
        await this.dataSource.query(sql);
      }

      if (!userData?.length) {
        const sqlFilePath = path.join(process.cwd(), 'seeders/sql/init-default-user.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf-8');
        await this.dataSource.query(sql);
      }

      this.logger.info(`[onApplicationBootstrap] init default users data successfully`);
    } catch (err) {
      this.logger.warn(`[onApplicationBootstrap] init default users data err: ${err}`);
      return;
    }
  }
}
