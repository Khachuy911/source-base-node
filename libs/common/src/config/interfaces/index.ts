import { AppConfig } from './app-config.interface';
import { DatabaseConfig } from './db-config.interface';
import { JwtConfig } from './jwt-config.interface';
import { RedisConfig } from './redis-config.interface';

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
}
