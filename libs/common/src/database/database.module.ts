import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppsConfigService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppsConfigService],
      useFactory: (configService: AppsConfigService) =>
        ({
          type: 'postgres',
          ...configService.dbConfig,
          autoLoadEntities: true,
          entities: [__dirname + '../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '../../migrations/*{.ts,.js}'],
          migrationsRun: false,
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
          timezone: 'Z',
          ...(configService.isProd
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {}),
        }) as TypeOrmModuleOptions,
    }),
  ],
})
export class DatabaseModule {}
