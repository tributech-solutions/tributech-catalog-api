import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import * as fs from 'fs-extra';
import { map } from 'lodash';
import { join } from 'path';
import { ModelEntity } from '../models/db-model';
import { Interface } from '../models/models';
import { ModelGraphService } from './model-graph.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  constructor(
    private modelStore: InMemoryDBService<ModelEntity>,
    private modelGraphService: ModelGraphService
  ) {}

  async saveModel(content: ModelEntity) {
    const fileName = this.encodeDTMI(content?.id);

    const [error, success] = await to(
      fs?.writeJson(join(process.cwd(), `/storage/${fileName}.json`), content)
    );
    if (error) return Promise.reject(error);

    return fileName;
  }

  async initStorage(): Promise<boolean> {
    this.logger.log('Initialize started...');
    this.logger.log(
      `Searching for files in ${join(process.cwd(), '/storage')}`
    );

    const [error, filenames] = await to(
      fs.readdir(join(process.cwd(), '/storage'))
    );
    if (error) return Promise.reject(error);
    const models = await Promise.all(
      map(filenames as any[], (name) => this.loadFile(name))
    );
    this.modelStore.createMany(
      map(models, (m: any) =>
        m?.model ? (m as ModelEntity) : this.createEntity(m)
      )
    );
    const [errorGraph, success] = await to(this.modelGraphService.initialize());
    if (errorGraph) return Promise.reject(errorGraph);
    this.logger.log('Initialize finished...');
    return true;
  }

  private async loadFile(fileName: string): Promise<ModelEntity | Interface> {
    const [error, file] = await to(
      fs?.readJson(join(process.cwd(), `/storage/${fileName}`))
    );
    if (error || !file) return Promise.reject(error);

    return file as ModelEntity;
  }

  private encodeDTMI(dtmi: string): string {
    return dtmi.replaceAll(':', '_').replaceAll(';', '__');
  }

  private createEntity(m: Required<Interface>): ModelEntity {
    return {
      id: m['@id'],
      active: true,
      createdTime: new Date().toISOString(),
      modifiedTime: '',
      model: m,
    };
  }
}
