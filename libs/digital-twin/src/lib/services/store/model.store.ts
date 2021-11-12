import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TwinModel } from '../../models/data.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelState extends EntityState<TwinModel, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Model', idKey: '@id' })
export class ModelStore extends EntityStore<ModelState> {
  constructor() {
    super();
  }
}