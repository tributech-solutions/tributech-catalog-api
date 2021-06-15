import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ModelGraphController } from './controllers/model-graph.controller';
import { ModelManagerController } from './controllers/model-manager.controller';
import { ValidationController } from './controllers/validation.controller';
import { ModelGraphService } from './model/model-graph.service';
import { ModelSeederService } from './model/model-seeder.service';
import { ModelService } from './model/model.service';
import { ValidationService } from './model/validation.service';

@Module({
  imports: [InMemoryDBModule.forRoot({})],
  controllers: [
    ModelManagerController,
    ModelGraphController,
    ValidationController,
  ],
  providers: [
    ModelService,
    ModelGraphService,
    ValidationService,
    ModelSeederService,
  ],
})
export class AppModule {}
