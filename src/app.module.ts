import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ModelGraphController } from './controllers/model-graph.controller';
import { ModelManagerController } from './controllers/model-manager.controller';
import { ValidationController } from './controllers/validation.controller';
import { ModelGraphService } from './services/model-graph.service';
import { ModelManagerService } from './services/model-manager.service';
import { StorageService } from './services/storage.service';
import { ValidationService } from './services/validation.service';

@Module({
  imports: [InMemoryDBModule.forRoot({})],
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
  ],
})
export class AppModule {}
