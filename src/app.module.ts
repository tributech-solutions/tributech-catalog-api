import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ModelGraphController } from './controllers/model-graph.controller';
import { ModelManagerController } from './controllers/model-manager.controller';
import { ModelGraphService } from './model/model-graph.service';
import { ModelService } from './model/model.service';

@Module({
  imports: [InMemoryDBModule.forRoot({})],
  controllers: [ModelManagerController, ModelGraphController],
  providers: [ModelService, ModelGraphService],
})
export class AppModule {}
