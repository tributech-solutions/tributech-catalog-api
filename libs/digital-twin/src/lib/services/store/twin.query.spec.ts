import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TwinInstance } from '@tributech/self-description';
import { ModelQuery } from './model.query';
import { RelationshipQuery } from './relationship.query';
import { RelationshipService } from './relationship.service';
import { RelationshipStore } from './relationship.store';
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

describe('TwinQuery', () => {
  let spectator: SpectatorService<TwinQuery>;
  let service: TwinService;

  const createService = createServiceFactory({
    service: TwinQuery,
    providers: [
      TwinStore,
      TwinService,
      mockProvider(RelationshipStore),
      mockProvider(RelationshipService),
      mockProvider(RelationshipQuery),
      mockProvider(ModelQuery),
    ],
    imports: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(TwinService);
  });

  it('should create service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should get all twin(s)', () => {
    service.addTwins(exampleTwin);
    service.addTwins(exampleTwin1);
    expect(spectator.service.getAllTwins()).toEqual([
      exampleTwin,
      exampleTwin1,
    ]);
  });

  it('should get twin(s) by model id', () => {
    service.addTwins(exampleTwin);
    expect(
      spectator.service.getTwinsByModelId(exampleTwin?.$metadata?.$model)
    ).toEqual([exampleTwin]);
  });

  it('should get twin by id', () => {
    service.addTwins(exampleTwin);
    expect(spectator.service.getTwinById(exampleTwin?.$dtId)).toEqual(
      exampleTwin
    );
  });
});
