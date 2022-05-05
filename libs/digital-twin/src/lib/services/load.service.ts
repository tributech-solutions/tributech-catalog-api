import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayUpdate } from '@datorama/akita';
import { ManageModelsService } from '@tributech/catalog-api';
import {
  ensureIsTwinGraph,
  Interface,
  isValidModel,
  mapToRelevantData,
  TwinFileModel,
  TwinGraph,
  uuidv4,
} from '@tributech/self-description';
import { DigitalTwin } from '@tributech/twin-api';
import { to } from 'await-to-js';
import { every as _every } from 'lodash';
import { take } from 'rxjs/operators';
import { TwinJsonModalComponent } from '../components/twin-json-modal/twin-json-modal.component';
import { getDeterministicGuid } from '../helpers/deterministic-utils';
import { DialogService } from '../other-components/dynamic-dialog/dialog.service';
import { FileService, ReadType } from './file.service';
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
      twinModels?.data.map((m) => m.model as unknown as Interface)
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

    const twin = this.resolveTwinTemplate(demoTwin);
    if (!twin) {
      return Promise.reject('Could not resolve template!');
    }

    return this.importTwinFile(twin);
  }

  async importModels(twinModels: Interface[]) {
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

  async loadExternalTemplateFile(currentRoot?: DigitalTwin) {
    const [uploadError, templateTwin] = await to(this.uploadTwinFile());

    if (uploadError || !templateTwin) {
      return Promise.reject(uploadError);
    }

    const twin = this.resolveTwinTemplate(templateTwin, currentRoot);
    if (!twin) {
      return Promise.reject('Could not resolve template!');
    }

    return this.importTwinFile(twin);
  }

  async importTwinFile(twinData: TwinFileModel | TwinGraph) {
    const twin = mapToRelevantData(twinData);

    if (!ensureIsTwinGraph(twin)) {
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

  private parseTwinString(twinString: string): Promise<TwinGraph> {
    let twinFile: TwinGraph;

    try {
      twinFile = JSON.parse(twinString);
    } catch (error) {
      return Promise.reject('Uploaded file is not a valid JSON file');
    }

    const twin = mapToRelevantData(twinFile);

    if (!ensureIsTwinGraph(twin)) {
      return Promise.reject('Uploaded file is not a valid twin file!');
    }

    return Promise.resolve(twin);
  }

  private resolveTwinTemplate(
    templateGraph: TwinGraph,
    currentRoot?: DigitalTwin
  ): TwinGraph {
    let rootGuid: string;
    let newRootTwin: DigitalTwin;

    if (currentRoot) {
      newRootTwin = templateGraph.digitalTwins.find(
        (t) => t.$metadata.$model === currentRoot.$metadata.$model
      );
      if (!newRootTwin) {
        return null;
      }
      rootGuid = currentRoot.$dtId;
    }

    if (!rootGuid) {
      rootGuid = uuidv4();
    }

    let m;
    let twinString;

    try {
      twinString = JSON.stringify(templateGraph);
    } catch (e) {
      return null;
    }

    const baseTokenRegex = new RegExp('\\$\\$uuid([0-9]+)\\$\\$', 'g');
    const replaceTokens = new Set<string>();

    do {
      m = baseTokenRegex.exec(twinString);
      if (m) {
        replaceTokens.add(m[0]);
      }
    } while (m);

    replaceTokens.forEach((token) => {
      twinString = this.replaceAll(twinString, token, uuidv4());
    });

    while (twinString.includes('$$random_uuid$$')) {
      twinString = this.replaceSingle(twinString, '$$random_uuid$$', uuidv4());
    }

    if (twinString.includes('$$root_uuid$$')) {
      twinString = this.replaceAll(twinString, '$$root_uuid$$', rootGuid);
    }

    let newGraph: TwinGraph;
    try {
      newGraph = JSON.parse(twinString);
    } catch (e) {
      return null;
    }

    // deterministic relationship its
    newGraph.relationships = newGraph.relationships.map((r) => {
      r.$relationshipId = getDeterministicGuid(r.$sourceId, r.$targetId);
      r.$etag = getDeterministicGuid(r.$sourceId, r.$targetId, 'ETag');
      return r;
    });

    // its its a device template we need to replace some additional parameters
    if (
      currentRoot &&
      ('DeviceId' in currentRoot || 'PublicKey' in currentRoot)
    ) {
      newRootTwin = {
        ...newRootTwin,
        DeviceId: currentRoot.DeviceId,
        PublicKey: currentRoot.PublicKey,
        $dtId: rootGuid,
      };
      newGraph.digitalTwins = arrayUpdate(
        newGraph.digitalTwins,
        (t) => t.$metadata.$model === currentRoot.$metadata.$model,
        newRootTwin
      );
    }

    return newGraph;
  }

  replaceAll(str: string, find: string, replace: string): string {
    return str.split(find).join(replace);
  }

  replaceSingle(str: string, find: string, replace: string): string {
    return str.replace(find, replace);
  }
}
