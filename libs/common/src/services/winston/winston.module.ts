import { DynamicModule } from '@nestjs/common';
import { WinstonService } from './winston.service';
import { createWinstonProviders } from './winston.provider';
import { randomUUID } from 'crypto';
import { ClsModule } from 'nestjs-cls';

export class WinstonModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createWinstonProviders();
    return {
      global: true,
      module: WinstonModule,
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            generateId: true,
            idGenerator: (req: Request) => {
              return req.headers['X-Request-Id'] ?? randomUUID();
            }
          },
        }),
      ],
      providers: [WinstonService, ...prefixedLoggerProviders],
      exports: [WinstonService, ...prefixedLoggerProviders],
    };
  }
}
