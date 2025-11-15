import { prefixesForLoggers } from './winston.decorator';
import { Provider } from '@nestjs/common';
import { WinstonService } from './winston.service';

function winstonFactory(logger: WinstonService, prefix: string) {
  if (prefix) {
    logger.setPrefix(prefix);
  }
  return logger;
}

function createWinstonProvider(prefix: string): Provider<WinstonService> {
  return {
    provide: `${prefix}Logger`,
    useFactory: logger => winstonFactory(logger, prefix),
    inject: [WinstonService],
  };
}

export function createWinstonProviders(): Array<Provider<WinstonService>> {
  return prefixesForLoggers.map(prefix => createWinstonProvider(prefix));
}
