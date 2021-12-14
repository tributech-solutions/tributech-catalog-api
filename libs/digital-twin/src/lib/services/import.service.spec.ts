import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import {
  createEmptyRelationship,
  Interface,
  TwinInstance,
  TwinRelationship,
} from '@tributech/self-description';
import { MockProvider } from 'ng-mocks';
import { ImportService } from './import.service';
import { RelationshipService } from './store/relationship/relationship.service';
import { SelfDescriptionService } from './store/self-description/self-description.service';
import { TwinService } from './store/twin-instance/twin.service';

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

const exampleTwin: TwinInstance = {
  $dtId: 'test01',
  $etag: 'etag-01',
  $metadata: {
    $model: 'dtmi:example:test;01',
  },
};

const exampleRel: TwinRelationship = createEmptyRelationship(
  'testRel',
  exampleTwin?.$dtId,
  exampleTwin?.$dtId
);

describe('ImportService', () => {
  let spectator: SpectatorService<ImportService>;
  const createService = createServiceFactory({
    service: ImportService,
    providers: [
      MockProvider(SelfDescriptionService),
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
    const modelService = spectator.inject(SelfDescriptionService);

    spectator.service.importModels([]);

    expect(modelService.addInterfaces).not.toHaveBeenCalled();

    spectator.service.importModels([exampleModel]);

    expect(modelService.addInterfaces).toHaveBeenCalledTimes(1);
    expect(modelService.addInterfaces).toHaveBeenCalledWith(
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
