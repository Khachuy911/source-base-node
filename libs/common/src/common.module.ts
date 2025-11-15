import { Global, Module, Provider } from '@nestjs/common';
import { AppsConfigService } from './services/apps-config.service';
import { RedisService } from './services/redis/redis.service';
import { TransactionalService } from './services/transaction.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config';

const providers: Provider[] = [
  AppsConfigService,
  TransactionalService,
  RedisService,
];
@Global()
@Module({
  imports: [
    // TypeOrmModule.forFeature([FileInfo]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers,
  exports: [...providers],
})
export class CommonModule {}
