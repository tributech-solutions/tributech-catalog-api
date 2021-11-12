import { Inject, Injectable } from '@angular/core';
import { isArray } from '@datorama/akita';
import { DialogService, uuidv4 } from '@tributech/core';
import {
  DigitalTwin,
  Relationship,
  RelationshipsService as RelationshipAPIService,
  TwinsService,
} from '@tributech/twin-api';
import to from 'await-to-js';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject,
} from 'rxjs';
import { debounceTime, map, mapTo } from 'rxjs/operators';
import { LoadService } from '../../services/load.service';
import { ModelQuery } from '../../services/store/model.query';
import { RelationshipQuery } from '../../services/store/relationship.query';
import { RelationshipService } from '../../services/store/relationship.service';
import { SelfDescriptionService } from '../../services/store/self-description/self-description.service';
import { TwinQuery } from '../../services/store/twin.query';
import { TwinService } from '../../services/store/twin.service';
import { createETag } from '../../utils/utils';
import { OFFLINE_MODE } from './twin-builder.settings';
import { TwinInstanceBuilderQuery } from './twin-instance-builder.query';

@Injectable({
  providedIn: 'root',
})
export class TwinBuilderService {
  private selectedTwinSubject: BehaviorSubject<DigitalTwin> =
    new BehaviorSubject<DigitalTwin>(null);
  selectedTwin$: Observable<DigitalTwin> =
    this.selectedTwinSubject.asObservable();

  private selectedRelSubject: BehaviorSubject<Relationship[]> =
    new BehaviorSubject<Relationship[]>(null);
  selectedRelationship$: Observable<Relationship[]> =
    this.selectedRelSubject.asObservable();

  hasSelection$: Observable<boolean> = combineLatest([
    this.selectedTwin$,
    this.selectedRelationship$,
  ]).pipe(map(([twin, rel]) => !!twin || !!rel));

  private manualRefreshTrigger: Subject<void> = new Subject<void>();

  twinGraphChanged$: Observable<void> = merge(
    this.twinQuery.selectEntityAction(),
    this.relationshipQuery.selectEntityAction(),
    this.manualRefreshTrigger.asObservable()
  ).pipe(debounceTime(500), mapTo(void 0));

  constructor(
    private modelLoadService: LoadService,
    private twinInstanceBuilderQuery: TwinInstanceBuilderQuery,
    private twinService: TwinService,
    private twinAPIService: TwinsService,
    private twinQuery: TwinQuery,
    private relationshipQuery: RelationshipQuery,
    private dialogService: DialogService,
    private relationshipAPIService: RelationshipAPIService,
    private relationshipService: RelationshipService,
    private selfDescriptionService: SelfDescriptionService,
    private modelQuery: ModelQuery,
    @Inject(OFFLINE_MODE) private offlineMode: boolean
  ) {}

  loadModels() {
    const loadingRef = this.dialogService.openLoadingModal('Loading models...');
    return this.modelLoadService.loadRemoteBaseModels().then(() => {
      loadingRef.close();
      this.selfDescriptionService.addInterfaces(
        this.modelQuery.getAll() as any[]
      );
    });
  }

  clearLoadedTwins() {
    this.twinService.deleteAllTwins();
    this.manualRefreshTrigger.next();
    this.resetSelection();
  }

  selectTwin(twin: DigitalTwin) {
    this.selectedTwinSubject.next(twin);
    this.selectedRelSubject.next(null);
  }

  selectRelationships(relationships: Relationship[]) {
    this.selectedTwinSubject.next(null);
    this.selectedRelSubject.next(relationships);
  }

  resetSelection() {
    this.selectedTwinSubject.next(null);
    this.selectedRelSubject.next(null);
  }

  async saveTwin(twin: DigitalTwin | [Relationship, DigitalTwin]) {
    const _twin = isArray(twin) ? twin?.[1] : twin;
    const _rel = isArray(twin) ? twin?.[0] : null;

    const [error, success] = await to(
      this.offlineMode
        ? Promise.resolve(true)
        : this.twinAPIService
            .createTwin(_twin)
            .toPromise()
            .then(() => true)
    );
    if (error) {
      this.dialogService.openErrorModal(error);
      return;
    }
    this.twinService.addTwins(_twin);
    this.dialogService.triggerSnackbar('Twin saved successfully');

    if (_rel) {
      await this.saveRel(_rel);
    }
  }

  async addTwinViaRelation(
    sourceTwin: DigitalTwin,
    relationshipName: string,
    targetTwin: DigitalTwin
  ) {
    const relationship: Relationship = {
      $etag: createETag(),
      $relationshipId: uuidv4(),
      $relationshipName: relationshipName,
      $targetId: targetTwin?.$dtId,
      $sourceId: sourceTwin?.$dtId,
    };

    const [error, success] = await to(
      this.offlineMode
        ? Promise.resolve(true)
        : this.twinAPIService
            .createTwin(targetTwin)
            .toPromise()
            .then(() => true)
    );
    if (error) {
      this.dialogService.openErrorModal(error);
      return;
    }
    this.twinService.addTwins(targetTwin);
    this.dialogService.triggerSnackbar('Twin saved successfully');

    if (relationship) {
      await this.saveRel(relationship);
    }
  }

  async saveRel(rel: Relationship) {
    const [error, success] = await to(
      this.offlineMode
        ? Promise.resolve(true)
        : this.relationshipAPIService
            .createRelationship(rel)
            .toPromise()
            .then(() => true)
    );
    if (error) {
      this.dialogService.openErrorModal(error);
      return;
    }
    this.relationshipService.addRelationships(rel);
    this.dialogService.triggerSnackbar('Relationship saved successfully');
  }

  async deleteTwin(twin: DigitalTwin) {
    const [error, success] = await to(
      this.offlineMode
        ? Promise.resolve(true)
        : this.twinAPIService
            .deleteTwin(twin?.$dtId)
            .toPromise()
            .then(() => true)
    );
    if (error) {
      this.dialogService.openErrorModal(error);
      return;
    }
    this.twinService.deleteTwin(twin?.$dtId);
    this.dialogService.triggerSnackbar('Twin deleted successfully');
  }

  clearAndLoad(dtId: string, setActive = true) {
    this.clearLoadedTwins();
    this.loadTwin(dtId, setActive);
  }

  loadTwin(dtId: string, setActive = true) {
    if (this.offlineMode) return;
    this.twinAPIService.getTwinById(dtId).subscribe((twin) => {
      this.twinService.addTwins(twin);
      if (setActive) {
        this.selectTwin(twin);
      }
      this.relationshipAPIService
        .getOutgoingRelationships(twin?.$dtId)
        .subscribe((rels) => {
          rels.forEach((r) => {
            this.loadTwin(r.$targetId, false);
            this.relationshipService.addRelationships(r);
          });
        });
    });
  }
}
