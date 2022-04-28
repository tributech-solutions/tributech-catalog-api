import { Inject, Injectable } from '@angular/core';
import { applyTransaction, isArray } from '@datorama/akita';
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
import { getDeterministicGuid } from '../../helpers/deterministic-utils';
import { DialogService } from '../../other-components/dynamic-dialog/dialog.service';
import { LoadService } from '../../services/load.service';
import { RelationshipQuery } from '../../services/store/relationship/relationship.query';
import { RelationshipService } from '../../services/store/relationship/relationship.service';
import { SelfDescriptionQuery } from '../../services/store/self-description/self-description.query';
import { SelfDescriptionService } from '../../services/store/self-description/self-description.service';
import { TwinQuery } from '../../services/store/twin-instance/twin.query';
import { TwinService } from '../../services/store/twin-instance/twin.service';
import { BUILDER_SETTINGS, TwinBuilderSettings } from './twin-builder.settings';

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

  private expandAllTrigger: Subject<void> = new Subject<void>();
  expandAll$ = this.expandAllTrigger.asObservable();

  private collapseAllTrigger: Subject<void> = new Subject<void>();
  collapseAll$ = this.collapseAllTrigger.asObservable();

  constructor(
    private modelLoadService: LoadService,
    private twinService: TwinService,
    private twinAPIService: TwinsService,
    private twinQuery: TwinQuery,
    private relationshipQuery: RelationshipQuery,
    private dialogService: DialogService,
    private relationshipAPIService: RelationshipAPIService,
    private relationshipService: RelationshipService,
    private selfDescriptionService: SelfDescriptionService,
    private selfDescriptionQuery: SelfDescriptionQuery,
    @Inject(BUILDER_SETTINGS) private builderSettings: TwinBuilderSettings
  ) {}

  loadModels() {
    const loadingRef = this.dialogService.openLoadingModal('Loading models...');
    return this.modelLoadService.loadRemoteBaseModels().then(() => {
      loadingRef.close();
    });
  }

  expandAll() {
    this.expandAllTrigger.next();
  }

  collapseAll() {
    this.collapseAllTrigger.next();
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

  async saveTwin(
    twin: DigitalTwin | [Relationship, DigitalTwin],
    forceSaveToApi: boolean = false
  ) {
    const _twin = isArray(twin) ? twin?.[1] : twin;
    const _rel = isArray(twin) ? twin?.[0] : null;

    // should we immediately update twins in twin-api
    if (this.builderSettings.saveTwinsOnApply || forceSaveToApi) {
      const [error, success] = await to(
        this.twinAPIService
          .createTwin(_twin)
          .toPromise()
          .then(() => true)
      );
      if (error) {
        this.dialogService.openErrorModal(error);
        return;
      }
      this.dialogService.triggerSnackbar('Twin saved successfully');
    }

    this.twinService.addTwins(_twin);

    if (_rel) {
      await this.saveRel(_rel, forceSaveToApi);
    }
  }

  async addTwinViaRelation(
    sourceTwin: DigitalTwin,
    relationshipName: string,
    targetTwin: DigitalTwin,
    forceSaveToApi: boolean = false
  ) {
    const relationship: Relationship = {
      $etag: getDeterministicGuid(sourceTwin?.$dtId, targetTwin?.$dtId, 'ETag'),
      $relationshipId: getDeterministicGuid(
        sourceTwin?.$dtId,
        targetTwin?.$dtId
      ),
      $relationshipName: relationshipName,
      $targetId: targetTwin?.$dtId,
      $sourceId: sourceTwin?.$dtId,
    };

    // should we immediately update twins in twin-api
    if (this.builderSettings.saveTwinsOnApply || forceSaveToApi) {
      const [error, success] = await to(
        this.twinAPIService
          .createTwin(targetTwin)
          .toPromise()
          .then(() => true)
      );
      if (error) {
        this.dialogService.openErrorModal(error);
        return;
      }
      this.dialogService.triggerSnackbar('Twin saved successfully');
    }

    await applyTransaction(async () => {
      if (relationship) {
        await this.saveRel(relationship, forceSaveToApi);
      }
      this.twinService.addTwins(targetTwin);
    });
  }

  async saveRel(rel: Relationship, forceSaveToApi: boolean = false) {
    if (this.builderSettings.saveTwinsOnApply || forceSaveToApi) {
      const [error, success] = await to(
        this.relationshipAPIService
          .createRelationship(rel)
          .toPromise()
          .then(() => true)
      );
      if (error) {
        this.dialogService.openErrorModal(error);
        return;
      }
      this.dialogService.triggerSnackbar('Relationship saved successfully');
    }

    this.relationshipService.addRelationships(rel);
  }

  async deleteTwin(twin: DigitalTwin, forceSaveToApi: boolean = false) {
    if (this.builderSettings.saveTwinsOnApply || forceSaveToApi) {
      const [error, success] = await to(
        this.twinAPIService
          .deleteTwin(twin?.$dtId)
          .toPromise()
          .then(() => true)
      );
      if (error) {
        this.dialogService.openErrorModal(error);
        return;
      }
      this.dialogService.triggerSnackbar('Twin deleted successfully');
    }

    this.twinService.deleteTwin(twin?.$dtId);
  }

  clearAndLoad(dtId: string, setActive = true) {
    this.clearLoadedTwins();
    this.loadTwin(dtId, setActive);
  }

  async loadTwin(dtId: string, setActive = true) {
    if (!this.builderSettings.loadTwinsFromServer) return;
    await applyTransaction(async () => {
      const [error, twin] = await to(
        this.twinAPIService.getTwinById(dtId).toPromise()
      );
      if (error) {
        return;
      }

      this.twinService.addTwins(twin);

      if (setActive) {
        this.selectTwin(twin);
      }
      const [relsError, rels] = await to(
        this.relationshipAPIService
          .getOutgoingRelationships(twin?.$dtId)
          .toPromise()
      );
      if (relsError) {
        return;
      }

      rels?.forEach((r) => {
        this.loadTwin(r.$targetId, false);
        this.relationshipService.addRelationships(r);
      });
    });
  }
}
