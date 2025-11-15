import { AppsConfigService, CommonModule, WinstonService } from '@lib/common';
import { AppModule } from 'services/node-api/src/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './swagger';
import { setupUtilities } from './utils';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  const logger = await app.resolve(WinstonService);
  const configService = app.select(CommonModule).get(AppsConfigService);

  try {
    app.setGlobalPrefix(configService.appConfig.baseUrl, {
      exclude: ['/v1/externals/mvapi(.*)'],
    });

    logger.info('Setting up Swagger...');

    setupSwagger(app, logger);

    setupUtilities(app, logger);
  } catch (err) {
    logger.error(`Error while init application: ${err}`);
    process.exit(1);
  }

  await app.listen(configService.appConfig.port);

  logger.info(`Server running on  : ${await app.getUrl()}`);
}
