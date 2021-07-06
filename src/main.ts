import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import jsonConfig from './config/load-config';
import { SettingsModel } from './config/settings.model';
import { StorageService } from './services/storage.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(StorageService);
  const config: SettingsModel = jsonConfig();
  const port = config?.Port;

  if (!config) {
    throw new Error('No config file loaded!');
  }

  await seeder?.initStorage();

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
      in: 'Authorization',
      scheme: 'Bearer',
      name: 'Bearer',
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
