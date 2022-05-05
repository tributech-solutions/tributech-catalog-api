import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import {
  ContextType,
  createEmptyRelationship,
  Interface,
  SelfDescriptionType,
  TwinInstance,
  TwinRelationship,
} from '@tributech/self-description';
import { MockProvider } from 'ng-mocks';
import { ExportService } from './export.service';
import { RelationshipQuery } from './store/relationship/relationship.query';
import { SelfDescriptionQuery } from './store/self-description/self-description.query';
import { TwinQuery } from './store/twin-instance/twin.query';

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

const exampleRel: TwinRelationship = createEmptyRelationship(
  'testRel',
  exampleTwin?.$dtId,
  exampleTwin1?.$dtId
);

const exampleModel: Partial<Interface> = {
  '@context': ContextType.DTDL2,
  '@id': 'dtmi:example:test;01',
  '@type': SelfDescriptionType.Interface,
  displayName: 'TestModel',
  contents: [
    {
      '@type': SelfDescriptionType.Relationship,
      name: 'testRel',
      target: 'dtmi:example:test;01',
    },
  ],
};

describe('ExportService', () => {
  let spectator: SpectatorService<ExportService>;
  const createService = createServiceFactory({
    service: ExportService,
    providers: [
      MockProvider(TwinQuery, {
        getAll: () => [exampleTwin, exampleTwin1],
      } as never),
      MockProvider(RelationshipQuery, { getAll: () => [exampleRel] } as never),
      MockProvider(SelfDescriptionQuery, {
        getAllInterfaces: () => [exampleModel],
      } as never),
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should create the correct export format', () => {
    const exportModel = spectator.service.save();

    expect(exportModel.digitalTwinsFileInfo.fileVersion).toBe('1.0.0');
    expect(exportModel.digitalTwinsGraph.digitalTwins).toEqual([
      exampleTwin,
      exampleTwin1,
    ]);
    expect(exportModel.digitalTwinsGraph.relationships).toEqual([exampleRel]);
    expect(exportModel.digitalTwinsModels).toEqual([exampleModel]);
  });
});
