import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TwinInstance } from '@tributech/self-description';
import { MockProvider } from 'ng-mocks';
import { RelationshipQuery } from '../relationship/relationship.query';
import { RelationshipService } from '../relationship/relationship.service';
import { RelationshipStore } from '../relationship/relationship.store';
import { SelfDescriptionQuery } from '../self-description/self-description.query';
import { TwinQuery } from './twin.query';
import { TwinService } from './twin.service';
import { TwinStore } from './twin.store';

const exampleTwin: TwinInstance = {
  $dtId: 'test01',
  $etag: 'etag-01',
  $metadata: {
    $model: 'dtmi:example:test;01',
  },
};

const exampleTwin1: TwinInstance = {
  $dtId: 'test02',
  $etag: 'etag-02',
  $metadata: {
    $model: 'dtmi:example:test;01',
  },
};

describe('Twin-Service|Store', () => {
  let spectator: SpectatorService<TwinService>;
  let query: TwinQuery;

  const createService = createServiceFactory({
    service: TwinService,
    providers: [
      TwinStore,
      TwinQuery,
      MockProvider(RelationshipStore),
      MockProvider(RelationshipService),
      MockProvider(RelationshipQuery),
      MockProvider(SelfDescriptionQuery),
    ],
    imports: [],
  });

  beforeEach(() => {
    spectator = createService();
    query = spectator.inject(TwinQuery);
  });

  it('should create service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should add twin(s)', () => {
    spectator.service.addTwins(exampleTwin);
    expect(query.getAllTwins()).toEqual([exampleTwin]);
    spectator.service.addTwins(exampleTwin1);
    expect(query.getAllTwins()).toEqual([exampleTwin, exampleTwin1]);
  });

  it('should update a twin and update etag', () => {
    spectator.service.addTwins(exampleTwin);
    expect(query.getAllTwins()).toEqual([exampleTwin]);
    spectator.service.updateTwin(exampleTwin?.$dtId, {
      ...exampleTwin,
      name: 'Test',
    });
    const storedTwin = query.getTwinById(exampleTwin?.$dtId);
    expect(storedTwin?.$etag).not.toEqual(exampleTwin?.$etag);
    expect(storedTwin?.name).toEqual('Test');
  });

  it('should delete a twin', () => {
    const relService = spectator.inject(RelationshipService);

    spectator.service.addTwins(exampleTwin);
    expect(query.getAllTwins()).toEqual([exampleTwin]);
    spectator.service.deleteTwin(exampleTwin?.$dtId);
    expect(query.getAllTwins()).toEqual([]);
    expect(relService.deleteTwinRelationships).toHaveBeenCalledTimes(1);
    expect(relService.deleteTwinRelationships).toHaveBeenCalledWith(
      exampleTwin?.$dtId
    );
  });

  it('should delete a twin but not its relationships', () => {
    const relService = spectator.inject(RelationshipService);

    spectator.service.addTwins(exampleTwin);
    expect(query.getAllTwins()).toEqual([exampleTwin]);
    spectator.service.deleteTwin(exampleTwin?.$dtId, true);
    expect(query.getAllTwins()).toEqual([]);
    expect(relService.deleteTwinRelationships).toHaveBeenCalledTimes(0);
  });

  it('should delete all twins and relations', () => {
    const relStore = spectator.inject(RelationshipStore);
    spectator.service.deleteAllTwins();
    expect(query.getAllTwins()).toEqual([]);
    expect(relStore?.reset).toHaveBeenCalledTimes(1);
  });
});
