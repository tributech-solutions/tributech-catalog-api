import { Injectable } from '@angular/core';
import { OrArray } from '@datorama/akita';
import { isArray as _isArray } from 'lodash';
import { TwinModel } from '../../models/data.model';
import { ModelStore } from './model.store';

@Injectable({ providedIn: 'root' })
export class ModelService {
  constructor(private modelStore: ModelStore) {}

  addModels(models: OrArray<TwinModel>) {
    console.log(
      `Adding ${_isArray(models) ? models?.length : '1'} model(s)...`
    );
    this.modelStore.add(models);
  }

  deleteModel(id: OrArray<string>) {
    console.log(`Deleting model(s) ${_isArray(id) ? id?.length : '1'} ...`);
    this.modelStore.remove(id);
  }
}
