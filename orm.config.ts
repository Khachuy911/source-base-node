import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSource = new DataSource({
  type: 'postgres', //mariadb
  host: '192.168.101.60',
  port: 5432,
  username: 'groupware',
  password: 'thwlsWkd123',
  database: 'groupware_dev',
  entities: ['libs/**/*.entity{.ts,.js}', 'services/node-api/src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  subscribers: [],
  migrationsRun: false,
  logging: true,
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
});
