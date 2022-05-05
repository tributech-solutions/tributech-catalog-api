import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { AuthenticationGuard } from './auth/auth.guard';
import { AuthenticationModule } from './auth/auth.module';
import jsonConfig from './config/load-config';
import { ApplicationController } from './controllers/application.controller';
import { HealthController } from './controllers/health.controller';
import { ModelGraphController } from './controllers/model-graph.controller';
import { ModelManagerController } from './controllers/model-manager.controller';
import { ValidationController } from './controllers/validation.controller';
import { InitializeService } from './services/initialize.service';
import { ModelGraphService } from './services/model-graph.service';
import { ModelManagerService } from './services/model-manager.service';
import { StorageService } from './services/storage.service';
import { ValidationService } from './services/validation.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [jsonConfig],
    }),
    InMemoryDBModule.forRoot({}),
    EventEmitterModule.forRoot({
      ignoreErrors: true,
    }),
    TerminusModule,
    AuthenticationModule,
  ],
  controllers: [
    ApplicationController,
    HealthController,
    ModelManagerController,
    ModelGraphController,
    ValidationController,
  ],
  providers: [
    ModelManagerService,
    ModelGraphService,
    ValidationService,
    StorageService,
    InitializeService,
    {
      provide: APP_GUARD,
      useExisting: AuthenticationGuard, //replaced useClass for https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers
    },
    AuthenticationGuard,
  ],
})
export class AppModule {}
