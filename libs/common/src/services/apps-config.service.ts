import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/interfaces/app-config.interface';
import { DatabaseConfig } from '../config/interfaces/db-config.interface';
import { JwtConfig } from '../config/interfaces/jwt-config.interface';
import { RedisConfig } from '../config/interfaces/redis-config.interface';

@Injectable()
export class AppsConfigService {
  constructor(private configService: ConfigService) {}

  //================== PUBLIC FUNC ==================
  get appConfig(): AppConfig {
    return this.get<AppConfig>('app');
  }

  get dbConfig() {
    return this.get<DatabaseConfig>('database');
  }

  get jwtConfig() {
    return this.get<JwtConfig>('jwt');
  }

  get redisConfig() {
    return this.get<RedisConfig>('redis');
  }


  get isDev(): boolean {
    return this.appConfig.nodeEnv === 'development';
  }

  get isProd(): boolean {
    return this.appConfig.nodeEnv === 'production';
  }

  get isStag(): boolean {
    return this.appConfig.nodeEnv === 'staging';
  }

  //================ PRIVATE FUNC ================
  private get<T>(key: string): T {
    return this.configService.get<T>(key);
  }
}
