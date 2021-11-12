import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManageModelsService, ModelEntity } from '@tributech/catalog-api';
import { DialogService, FileService, ReadType, uuidv4 } from '@tributech/core';
import { to } from 'await-to-js';
import { every as _every } from 'lodash';
import { take } from 'rxjs/operators';
import { TwinJsonModalComponent } from '../components/twin-json-modal/twin-json-modal.component';
import { DigitalTwinModel, Interface, TwinModel } from '../models/data.model';
import {
  ensureIsValidTwinFile,
  isValidModel,
  mapToRelevantData,
} from '../utils/utils';
import { ImportService } from './import.service';

@Injectable({ providedIn: 'root' })
export class LoadService {
  modelsAreLoaded = false;

  constructor(
    private http: HttpClient,
    private importService: ImportService,
    private manageService: ManageModelsService,
    private fileService: FileService,
    private dialogService: DialogService
  ) {}

  async loadFromDialog() {
    const ref = this.dialogService.open(TwinJsonModalComponent);
    const twinString = await ref?.afterClosed().pipe(take(1)).toPromise();

    if (!twinString) return;

    const [error, graph] = await to(this.parseTwinString(twinString));
    if (error || !graph) {
      this.dialogService.openErrorModal(error);
      return;
    }

    const [loadError, success] = await to(this.importTwinFile(graph));

    if (loadError) {
      this.dialogService.openErrorModal(loadError);
      return;
    }

    this.dialogService.triggerSnackbar('Twins imported successfully!');
  }

  async loadRemoteBaseModels() {
    if (this.modelsAreLoaded) return Promise.resolve();
    const [error, twinModels] = await to(
      this.manageService.getAllEntities(100, 0).toPromise()
    );

    if (error) {
      return Promise.reject('Unknown error at base model import!');
    }
    return this.importModels(
      (twinModels.data as unknown as ModelEntity[]).map(
        (m) => m.model as unknown as Interface
      )
    );
  }

  async loadAdditionalModels() {
    const [uploadError, twinModels] = await to(
      this.fileService.upload({ multiple: true, readAs: ReadType.Text })
    );

    if (uploadError || !twinModels) {
      return Promise.reject(uploadError);
    }

    try {
      const models = (twinModels as string[]).map((model) => JSON.parse(model));

      return this.importModels(models);
    } catch (e) {
      return Promise.reject('Invalid JSON file ' + e.toString());
    }
  }

  async loadDemoTwin(url: string) {
    const [error, demoTwin] = await to(this.http.get(url).toPromise());

    if (error || !demoTwin) {
      return Promise.reject(error);
    }

    const [parseError, twin] = await to(
      this.parseTwinString(this.replaceTokens(JSON.stringify(demoTwin)))
    );
    if (parseError || !twin) {
      return Promise.reject(parseError);
    }

    return this.importTwinFile(twin);
  }

  async importModels(twinModels: TwinModel[]) {
    if (!_every(twinModels, (twin) => isValidModel(twin))) {
      return Promise.reject('Some models are invalid, aborting import.');
    }

    this.importService.importModels(twinModels);
    this.modelsAreLoaded = true;
    return Promise.resolve();
  }

  async loadExternalTwinFile() {
    const [uploadError, twin] = await to(this.uploadTwinFile());

    if (uploadError || !twin) {
      return Promise.reject(uploadError);
    }

    return this.importTwinFile(twin);
  }

  async importTwinFile(twinData: DigitalTwinModel) {
    const twin = mapToRelevantData(twinData);

    if (!ensureIsValidTwinFile(twin)) {
      return Promise.reject('Invalid twin file, aborting import...');
    }

    this.importService.importInstances(twin);
    return Promise.resolve();
  }

  private async uploadTwinFile() {
    const [uploadError, twinString] = await to(this.fileService.upload());

    if (uploadError || !twinString) {
      return Promise.reject(uploadError);
    }
    return this.parseTwinString(twinString as string);
  }

  private parseTwinString(twinString: string): Promise<DigitalTwinModel> {
    let twinFile: DigitalTwinModel;

    try {
      twinFile = JSON.parse(twinString);
    } catch (error) {
      return Promise.reject('Uploaded file is not a valid JSON file');
    }

    const twin = mapToRelevantData(twinFile);

    if (!ensureIsValidTwinFile(twin)) {
      return Promise.reject('Uploaded file is not a valid twin file!');
    }

    return Promise.resolve(twin);
  }

  private replaceTokens(twinString: string): string {
    const tokenRegex = new RegExp('\\$\\$uuid([0-9]+)\\$\\$', 'g');
    const replaceTokens = new Set<string>();
    let m;

    do {
      m = tokenRegex.exec(twinString);
      if (m) {
        replaceTokens.add(m[0]);
      }
    } while (m);

    replaceTokens.forEach((token) => {
      twinString = this.replaceAll(twinString, token, uuidv4());
    });

    while (twinString.includes('$$uuid$$')) {
      twinString = this.replaceSingle(twinString, '$$uuid$$', uuidv4());
    }

    return twinString;
  }

  replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  replaceSingle(str: string, find: string, replace: string): string {
    return str.replace(find, replace);
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}
