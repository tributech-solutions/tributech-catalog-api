import { Injectable } from '@angular/core';
import {
  combineQueries,
  HashMap,
  isArray,
  isString,
  QueryEntity,
} from '@datorama/akita';
import { cloneDeep, map as _map } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  isContentSD,
  isInterfaceSD,
  isSchemaSD,
  SelfDescription,
} from '../../../models/data.model';
import {
  SelfDescriptionState,
  SelfDescriptionStore,
} from './self-description.store';

@Injectable({ providedIn: 'root' })
export class SelfDescriptionQuery extends QueryEntity<SelfDescriptionState> {
  constructor(protected store: SelfDescriptionStore) {
    super(store);
  }

  treeData$ = this.selectAll({
    filterBy: (sd) => isInterfaceSD(sd),
  }).pipe(
    map((models) =>
      models.map((m) => ({
        ...m,
        hasChildren:
          isInterfaceSD(m) && (m.contents?.length > 0 || m.schemas?.length > 0),
      }))
    ),
    map((models) => [...models])
  );

  selectDenormalized(id: string): Observable<SelfDescription> {
    return combineQueries([
      this.selectEntity(id),
      this.selectAll({ asObject: true }),
    ]).pipe(
      map(([sd, all]) => {
        return this.denormalizeInObject(cloneDeep(sd), all);
      })
    );
  }

  getDenormalized(id: string): SelfDescription {
    return this.denormalizeInObject(
      cloneDeep(this.getEntity(id)),
      this.getAll({ asObject: true })
    );
  }

  getContents(selfDescription: SelfDescription) {
    if (!isInterfaceSD(selfDescription)) return [];

    const contentIRIs: string[] =
      selfDescription?.contents?.map((sd: SelfDescription | string) =>
        isString(sd) ? sd : sd['@id']
      ) ?? [];

    return this.getAll({
      filterBy: (sd) => contentIRIs.includes(sd?.['@id']),
    });
  }

  getSchemas(selfDescription: SelfDescription) {
    if (!isInterfaceSD(selfDescription)) return [];

    const schemaIRIs: string[] =
      selfDescription?.schemas?.map((sd: SelfDescription | string) =>
        isString(sd) ? sd : sd['@id']
      ) ?? [];

    return this.getAll({
      filterBy: (sd) => schemaIRIs.includes(sd?.['@id']),
    });
  }

  getSchemaIRIs() {
    return _map(
      this.getAll({
        filterBy: (sd) => isSchemaSD(sd),
      }),
      '@id'
    );
  }

  getInterfaceIRIs() {
    return _map(
      this.getAll({
        filterBy: (sd) => isInterfaceSD(sd),
      }),
      '@id'
    );
  }

  getContentIRIs() {
    return _map(
      this.getAll({
        filterBy: (sd) => isContentSD(sd),
      }),
      '@id'
    );
  }

  private denormalizeInObject(obj, hashTree: HashMap<SelfDescription>) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      let v = null;

      if (
        key === '@id' ||
        key === 'extends' ||
        key === 'target' ||
        key === 'schema'
      ) {
        result[key] = value;
        continue;
      }

      if (isString(value)) {
        v = hashTree[value] || value;
      } else if (isArray(value)) {
        v = cloneDeep(value);
        for (let i = 0; i < value.length; i++) {
          if (isString(v[i]) && hashTree[v[i]]) {
            // we can replace the dtmi with an object
            v[i] = hashTree[v[i]];
          }
        }
      } else {
        v = value;
      }
      result[key] = v;
    }

    return result;
  }
}
