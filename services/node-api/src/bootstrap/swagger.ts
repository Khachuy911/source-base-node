import { AppsConfigService, WinstonService } from '@lib/common';
import { AppModule } from 'services/node-api/src/app.module';
import { AuthModule } from 'services/node-api/src/modules/auth/auth.module';
import { UsersModule } from 'services/node-api/src/modules/users/users.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: NestExpressApplication, logger: WinstonService) {
  const appConfigService = app.get(AppsConfigService);

  if (appConfigService.appConfig.swaggerEnable) {
    logger.info('Init Swagger');

    const server = app.getHttpAdapter();

    const config = new DocumentBuilder()
      .setTitle('Telematics Video & Data Platform ')
      .setDescription('Node APIs | [swagger-spec.json](swagger/swagger.json)')
      .setVersion('1.0')
      .addBearerAuth()
      .addGlobalParameters({
        in: 'header',
        required: false,
        name: 'gmt',
        schema: {
          example: '+07:00',
        },
        description: 'Timezone',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: [AppModule, AuthModule, UsersModule],
    });

    server.get(`/swagger/swagger.json`, (_req, res: any) => {
      res.json(document);
    });

    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        syntaxHighlight: {
          activated: false,
          theme: 'agate',
        },
      },
    });
  }
}
