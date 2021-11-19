import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Interface } from '@tributech/self-description';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelState extends EntityState<Interface, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Model', idKey: '@id' })
export class ModelStore extends EntityStore<ModelState> {
  constructor() {
    super();
  }
}
