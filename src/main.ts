import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { StorageService } from './services/storage.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(StorageService);

  await seeder?.initStorage();

  const config = new DocumentBuilder()
    .setTitle('Tributech catalog')
    .setDescription('The catalog API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
