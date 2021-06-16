import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/auth.guard';
import { AuthenticationModule } from './auth/auth.module';
import jsonConfig from './config/load-config';
import { ModelGraphController } from './controllers/model-graph.controller';
import { ModelManagerController } from './controllers/model-manager.controller';
import { ValidationController } from './controllers/validation.controller';
import { ModelGraphService } from './services/model-graph.service';
import { ModelManagerService } from './services/model-manager.service';
import { StorageService } from './services/storage.service';
import { ValidationService } from './services/validation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [jsonConfig],
    }),
    InMemoryDBModule.forRoot({}),
    AuthenticationModule,
  ],
  controllers: [
    ModelManagerController,
    ModelGraphController,
    ValidationController,
  ],
  providers: [
    ModelManagerService,
    ModelGraphService,
    ValidationService,
    StorageService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
