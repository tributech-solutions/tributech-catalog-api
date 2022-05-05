import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { to } from 'await-to-js';
import { AppModule } from './app.module';
import jsonConfig from './config/load-config';
import { SettingsModel } from './config/settings.model';
import { InitializeService } from './services/initialize.service';
import { ModelGraphService } from './services/model-graph.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const seeder = app.get(InitializeService);
  const modelGraphService = app.get(ModelGraphService);

  const config: SettingsModel = jsonConfig();
  const port = config?.Port;

  if (!config) {
    logger.error('No config file found!');
    throw new Error('No config file found!');
  }

  const [errorInit, successInit] = await to(seeder?.initialize());
  if (errorInit) {
    logger.error('Error while initializing models', errorInit);
    throw errorInit;
  }
  logger.log('Initialized vocabulary successfully.');

  const [errorGraph, successGraph] = await to(modelGraphService.initialize());
  if (errorGraph) {
    logger.error('Error while initializing graph', errorInit);
    throw errorGraph;
  }
  logger.log('Initialized graph successfully.');

  const authConfig = config.ApiAuthOptions;
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tributech catalog')
    .setDescription(
      '<p>API to access and manage the known vocabulary for this node.<br /><br />' +
        '<a href="https://tributech.io" title="Website">Website</a><br />' +
        '<a href="https://github.com/tributech-solutions/tributech-catalog-api-client" title ="API Client on GitHub">API Client on GitHub</a><br />' +
        '<a href="https://tributech.atlassian.net/servicedesk/customer/portals" title ="Customer Support Portal">Customer Support Portal</a><br /></p>'
    )
    .setVersion('1.0')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        clientCredentials: {
          tokenUrl: authConfig?.TokenUrl,
          scopes: Object.assign(
            {},
            ...authConfig?.Scopes.map((x) => ({ [x]: x }))
          ),
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
