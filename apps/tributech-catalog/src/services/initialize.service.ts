import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { isValidModel } from '@tributech/self-description';
import { to } from 'await-to-js';
import * as fs from 'fs-extra';
import { map as _map } from 'lodash';
import { join } from 'path';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import jsonConfig from '../config/load-config';
import { SettingsModel } from '../config/settings.model';
import { ModelEntity } from '../models/db-model';
import { Interface } from '../models/models';
import { Vocabulary } from '../models/vocabulary';

@Injectable()
export class InitializeService {
  private readonly logger = new Logger(InitializeService.name);

  constructor(
    private modelStore: InMemoryDBService<ModelEntity>,
    private httpService: HttpService
  ) {}

  async initialize(): Promise<boolean> {
    await this.loadExternalCatalogs();
    await this.loadExternalModels();
    await this.loadExistingModels();
    return true;
  }

  getConfig(): SettingsModel {
    return jsonConfig();
  }

  private async loadExternalModels() {
    this.logger.log('Checking if external models should be loaded...');

    const config: SettingsModel = this.getConfig();
    if (!config?.ExternalModels || config?.ExternalModels.length === 0) {
      return;
    }

    this.logger.log(
      `Loading ${config.ExternalModels.length} default vocabulary entries.`
    );

    await this.loadModelsFromURL(config.ExternalModels);
  }

  private async loadExternalCatalogs() {
    this.logger.log('Checking if external catalog(s) should be loaded...');

    const config: SettingsModel = this.getConfig();
    if (!config?.ExternalCatalogs || config?.ExternalCatalogs.length === 0) {
      return;
    }

    this.logger.log(
      `Loading ${config.ExternalCatalogs.length} external catalog(s).`
    );

    const [error, catalogs] = await to(
      Promise.all(
        config.ExternalCatalogs.map((m) => this.downloadFromURL<Vocabulary>(m))
      )
    );
    if (error || !catalogs) {
      this.logger.error('Error downloading external catalog(s)', error);
      return;
    }

    const filtered = catalogs.filter((m) => this.isValidVocabulary(m));
    this.logger.log(`Loading ${filtered.length} default vocabulary entries.`);
    let loadPromises: Promise<void>[] = [];

    for (const catalog of filtered) {
      loadPromises = [
        ...loadPromises,
        this.loadModelsFromURL(catalog?.references || []),
      ];
    }

    const [loadError, models] = await to(Promise.all(loadPromises));
    if (loadError || !models) {
      this.logger.error('Error downloading models', error);
      return;
    }
  }

  private async loadExistingModels() {
    this.logger.log(
      `Loading existing models in ${join(process.cwd(), '/storage')}`
    );

    if (!fs.existsSync(join(process.cwd(), '/storage'))) {
      fs.mkdirSync(join(process.cwd(), '/storage'));
    }

    const [error, filenames] = await to(
      fs.readdir(join(process.cwd(), '/storage'))
    );
    if (error) {
      return Promise.reject(error);
    }
    if (!filenames) {
      this.logger.log(
        `No existing models found in ${join(
          process.cwd(),
          '/storage'
        )}, continuing...`
      );
      return;
    }

    const models = await Promise.all(
      _map(filenames, (name) => this.loadFile(name))
    );
    this.modelStore.updateMany(
      _map(models, (m: any) =>
        m?.model ? (m as ModelEntity) : this.createEntity(m)
      )
    );
  }

  private async loadModelsFromURL(urls: string[]) {
    const loadPromises = urls.map((m) =>
      this.downloadFromURL<Interface | ModelEntity>(m)
    );
    const [error, models] = await to(Promise.all(loadPromises));

    if (error || !models) {
      this.logger.error('Error downloading models', error);
      return;
    }

    const filteredModels = models.filter(
      (m) => this.isModelEntity(m) || isValidModel(m)
    );

    // Add support for loading model entities as well, so we can set default metadata about the models
    this.modelStore.updateMany(
      _map(filteredModels, (m: Interface | ModelEntity) =>
        this.isModelEntity(m) ? m : this.createEntity(m as Required<Interface>)
      )
    );
    this.logger.log(`Loaded ${filteredModels.length} models.`);
  }

  private downloadFromURL<T>(url: string) {
    return this.httpService
      .get<T>(url, { responseType: 'json' })
      .pipe(
        map((response: AxiosResponse<T>) => response?.data),
        catchError((err) => {
          this.logger.error(`Error downloading file ${url}`, err);
          return of(null);
        })
      )
      .toPromise();
  }

  private isModelEntity(obj: any): obj is ModelEntity {
    if (!obj) return false;
    return 'model' in obj;
  }

  private isValidVocabulary(obj: any): obj is Vocabulary {
    if (!obj) return false;
    return 'name' in obj && 'references' in obj;
  }

  private async loadFile(fileName: string): Promise<ModelEntity | Interface> {
    const [error, file] = await to(
      fs?.readJson(join(process.cwd(), `/storage/${fileName}`))
    );
    if (error || !file) return Promise.reject(error);

    return file as ModelEntity | Interface;
  }

  private createEntity(m: Required<Interface>): ModelEntity {
    return {
      id: m['@id'],
      active: true,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      model: m,
    };
  }
}
