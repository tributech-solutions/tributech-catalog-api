import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { StorageService } from './services/storage.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(StorageService);
  const configService = app.get(ConfigService);

  await seeder?.initStorage();

  const config = new DocumentBuilder()
    .setTitle('Tributech catalog')
    .setDescription(
      '<p>API to access and manage the known vocabulary for this node.<br /><br />' +
        '<a href="https://tributech.io" title="Website">Website</a><br />' +
        '<a href="https://github.com/tributech-solutions/tributech-dsk-api-clients" title ="API Clients on GitHub">API Clients on GitHub</a><br />' +
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
          tokenUrl: process.env.AUTH_TOKEN_URL,
          scopes:
            process.env.AUTH_SCOPES?.split(' ').reduce(
              (obj, scope) => (obj[scope] = scope),
              {}
            ) || {},
        },
        authorizationCode: {
          tokenUrl: process.env.AUTH_TOKEN_URL,
          authorizationUrl: process.env.AUTH_URL,
          scopes:
            process.env.AUTH_SCOPES?.split(' ').reduce(
              (obj, scope) => (obj[scope] = scope),
              {}
            ) || {},
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('Port', 3000));
}
bootstrap();
