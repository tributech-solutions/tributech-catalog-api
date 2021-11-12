import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockProvider } from 'ng-mocks';
import {
  BaseDigitalTwin,
  BasicRelationship,
  Interface,
} from '../models/data.model';
import { createEmptyRelationship } from '../utils/utils';
import { ImportService } from './import.service';
import { ModelService } from './store/model.service';
import { RelationshipService } from './store/relationship.service';
import { TwinService } from './store/twin.service';

const exampleModel: Interface = {
  '@context': 'dtmi:dtdl:context;2',
  '@id': 'dtmi:example:test;01',
  '@type': 'Interface',
  displayName: 'TestModel',
  contents: [
    {
      '@type': 'Relationship',
      name: 'testRel',
      target: 'dtmi:example:test;01',
    },
  ],
} as Interface;

const exampleTwin: BaseDigitalTwin = {
  $dtId: 'test01',
  $etag: 'etag-01',
  $metadata: {
    $model: 'dtmi:example:test;01',
  },
};

const exampleRel: BasicRelationship = createEmptyRelationship(
  'testRel',
  exampleTwin?.$dtId,
  exampleTwin?.$dtId
);

describe('ImportService', () => {
  let spectator: SpectatorService<ImportService>;
  const createService = createServiceFactory({
    service: ImportService,
    providers: [
      MockProvider(ModelService),
      MockProvider(TwinService),
      MockProvider(RelationshipService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should import models if some are passed', () => {
    const modelService = spectator.inject(ModelService);

    spectator.service.importModels([]);

    expect(modelService.addModels).not.toHaveBeenCalled();

    spectator.service.importModels([exampleModel]);

    expect(modelService.addModels).toHaveBeenCalledTimes(1);
    expect(modelService.addModels).toHaveBeenCalledWith(
      expect.arrayContaining([exampleModel])
    );
  });

  it('should import twin and relationship instances', () => {
    const twinService = spectator.inject(TwinService);
    const relService = spectator.inject(RelationshipService);

    spectator.service.importInstances({
      digitalTwins: null,
      relationships: [],
    });

    expect(twinService.addTwins).not.toHaveBeenCalled();
    expect(relService.addRelationships).not.toHaveBeenCalled();

    spectator.service.importInstances({
      digitalTwins: [exampleTwin],
      relationships: [exampleRel],
    });

    expect(twinService.addTwins).toHaveBeenCalledTimes(1);
    expect(twinService.addTwins).toHaveBeenCalledWith(
      expect.arrayContaining([exampleTwin])
    );

    expect(relService.addRelationships).toHaveBeenCalledTimes(1);
    expect(relService.addRelationships).toHaveBeenCalledWith(
      expect.arrayContaining([exampleRel])
    );
  });
});
