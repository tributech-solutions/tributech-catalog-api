import { Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import * as fs from 'fs-extra';
import { join } from 'path';
import { ModelEntity } from '../models/db-model';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  async saveModel(content: ModelEntity) {
    const fileName = this.encodeDTMI(content?.id);

    const [error, success] = await to(
      fs?.writeJson(join(process.cwd(), `/storage/${fileName}.json`), content)
    );
    if (error) return Promise.reject(error);

    return fileName;
  }

  private encodeDTMI(dtmi: string): string {
    return dtmi.replaceAll(':', '_').replaceAll(';', '__');
  }
}
