import { Injectable } from '@angular/core';
import {
  combineQueries,
  EntityActions,
  HashMap,
  isArray,
  isString,
  QueryEntity,
} from '@datorama/akita';
import {
  context,
  ExpandedInterface,
  expandInterface,
  getChildrenVertices,
  hasNoIncomingRelationships,
  Interface,
  isContentSD,
  isInterfaceSD,
  isSchemaSD,
  REL_TARGET_ANY,
  SelfDescription,
} from '@tributech/self-description';
import { JsonldGraph } from 'jsonld-graph';
import { cloneDeep, map as _map } from 'lodash';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SelfDescriptionState,
  SelfDescriptionStore,
} from './self-description.store';

@Injectable({ providedIn: 'root' })
export class SelfDescriptionQuery extends QueryEntity<SelfDescriptionState> {
  private modelGraph: JsonldGraph;

  constructor(protected store: SelfDescriptionStore) {
    super(store);
    this.initialize();
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

  selectAllInterfaces(): Observable<Interface[]> {
    return combineQueries([
      this.selectAll({
        filterBy: (sd) => isInterfaceSD(sd),
      }) as unknown as Observable<Interface[]>,
      this.selectAll({ asObject: true }),
    ]).pipe(
      map(
        ([sd, all]) =>
          sd.map((s) =>
            this.denormalizeInObject(cloneDeep(s), all)
          ) as Interface[]
      )
    );
  }

  getDenormalized(id: string): SelfDescription {
    return this.denormalizeInObject(
      cloneDeep(this.getEntity(id)),
      this.getAll({ asObject: true })
    );
  }

  getAllInterfaces(): Interface[] {
    const interfaces: Interface[] = this.getAll({
      filterBy: (sd) => isInterfaceSD(sd),
    }) as Interface[];

    return interfaces.map(
      (i) =>
        this.denormalizeInObject(
          cloneDeep(i),
          this.getAll({ asObject: true })
        ) as Interface
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

  getTwinGraphModelWithParents(modelId: string): ExpandedInterface[] {
    const vertices: ExpandedInterface[] = [];
    const vertex = this.modelGraph.getVertex(modelId);

    if (!vertex) return [];

    vertices.push(expandInterface(vertex));

    if (!vertex?.hasIncoming('dtmi:dtdl:property:extends;2')) {
      return vertices;
    }

    vertices.push(
      ...getChildrenVertices(vertex).map((v) => expandInterface(v))
    );

    return vertices;
  }

  getTwinGraphModel(modelId: string): ExpandedInterface {
    const model = this.modelGraph.getVertex(modelId);
    return expandInterface(model);
  }

  getTwinGraphModels(): ExpandedInterface[] {
    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();

    return models.map((model) => expandInterface(model));
  }

  getRootModels(): ExpandedInterface[] {
    const models = this.modelGraph
      .getVertices()
      .filter((x) => x.isType('dtmi:dtdl:class:Interface;2'))
      .items();

    const roots = models.filter((x) => hasNoIncomingRelationships(x));

    return roots.map((m) => expandInterface(m));
  }

  getTwinGraphModelsForIds(modelIds: string[]): ExpandedInterface[] {
    if (!modelIds) return [];
    return modelIds.map((id) => this.getTwinGraphModel(id));
  }

  getInvolvedRelationships(sourceModelId: string, targetModelId?: string) {
    const sourceModel = this.getTwinGraphModel(sourceModelId);
    if (targetModelId) {
      const targetModel = this.getTwinGraphModel(targetModelId);
      return sourceModel.relationships.filter(
        (x) =>
          x.target === REL_TARGET_ANY ||
          x.target === targetModelId ||
          targetModel.bases.some((y) => y === x.target)
      );
    }
    return sourceModel?.relationships || [];
  }

  private initialize() {
    if (!this.modelGraph) {
      const models = this.getAllInterfaces();
      // Load contexts/vocabulary
      this.modelGraph = new JsonldGraph();
      this.modelGraph.addContext('dtmi:dtdl:context;2', context);

      merge(
        this.selectEntityAction(EntityActions.Add),
        this.selectEntityAction(EntityActions.Update)
      )
        .pipe(
          map((modelIds: string[]) =>
            modelIds.map((modelId: string) => this.getDenormalized(modelId))
          ),
          map(
            (selfDescriptions) =>
              selfDescriptions.filter((sd) => isInterfaceSD(sd)) as Interface[]
          )
        )
        .subscribe((models) => this.loadModelsIntoGraph(models));

      this.selectEntityAction(EntityActions.Remove).subscribe(
        (modelIds: string[]) => {
          modelIds.map((modelId: string) => this.removeTwinGraphModel(modelId));
        }
      );

      if (models.length > 0) {
        this.loadModelsIntoGraph(models);
      }
    }
  }

  private loadModelsIntoGraph(models: Interface[]) {
    if (models?.length > 0) {
      this.modelGraph.parse(models, { contexts: context['@context'] });
    }
  }

  private removeTwinGraphModel(modelId: string) {
    const model = this.modelGraph.getVertex(modelId);
    if (model) {
      this.modelGraph.removeVertex(model);
    }
  }

  private denormalizeInObject(
    obj,
    hashTree: HashMap<SelfDescription>
  ): SelfDescription {
    const result: SelfDescription = {};
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
