import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import { AllExceptionsFilter } from 'services/node-api/src/common/exceptions/http.exception';
import { WinstonService } from '@lib/common';
import { urlencoded, json } from 'express';

export function setupUtilities(app: NestExpressApplication, logger: WinstonService) {
  logger.info('Init Utilities');
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        ),
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  app.use(compression());
}
