import { Injectable } from '@angular/core';
import { OrArray } from '@datorama/akita';
import { Interface } from '@tributech/self-description';
import { ModelStore } from './model.store';

@Injectable({ providedIn: 'root' })
export class ModelService {
  constructor(private modelStore: ModelStore) {}

  addModels(models: OrArray<Interface>) {
    this.modelStore.add(models);
  }

  deleteModel(id: OrArray<string>) {
    this.modelStore.remove(id);
  }
}
