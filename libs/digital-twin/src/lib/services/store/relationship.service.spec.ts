import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { uuidv4 } from '@tributech/core';
import { BasicRelationship } from '../../models/data.model';
import { createEmptyRelationship, createETag } from '../../utils/utils';
import { RelationshipQuery } from './relationship.query';
import { RelationshipService } from './relationship.service';
import { RelationshipStore } from './relationship.store';

const exampleRel: BasicRelationship = createEmptyRelationship(
  'testRel',
  'parent01',
  'child01'
);

const exampleRel1: BasicRelationship = createEmptyRelationship(
  'testRel',
  'parent01',
  'child02'
);

describe('Relationship-Service|Store|Query', () => {
  let spectator: SpectatorService<RelationshipService>;
  let query: RelationshipQuery;

  const createService = createServiceFactory({
    service: RelationshipService,
    providers: [RelationshipStore, RelationshipQuery],
    imports: [],
  });

  beforeEach(() => {
    spectator = createService();
    query = spectator.inject(RelationshipQuery);
  });

  it('should create service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should add relationship(s)', () => {
    spectator.service.addRelationships(exampleRel);
    expect(query.getAll()).toEqual([exampleRel]);
    spectator.service.addRelationships(exampleRel1);
    expect(query.getAll()).toEqual([exampleRel, exampleRel1]);
  });

  it('should add a new relationship', () => {
    const relName = 'relName';
    const targetId = 'targetId';
    const sourceId = 'sourceId';

    const _rel: BasicRelationship = {
      $etag: createETag(),
      $relationshipId: uuidv4(),
      $relationshipName: relName,
      $targetId: targetId,
      $sourceId: sourceId,
    };

    spectator.service.addRelationships(_rel);
    expect(query.getCount()).toEqual(1);
    const rel = query.getEntity(_rel.$relationshipId);
    expect(rel).toBeTruthy();
    expect(rel?.$relationshipName).toEqual(relName);
    expect(rel?.$targetId).toEqual(targetId);
  });

  it('should upsert relationship and update etag', () => {
    spectator.service.addRelationships(exampleRel);
    expect(query.getAll()).toEqual([exampleRel]);
    spectator.service.updateRelationship({
      ...exampleRel,
      prop: 'Test',
    });
    const storedRel = query.getEntity(exampleRel?.$relationshipId);
    expect(storedRel?.$etag).not.toEqual(exampleRel?.$etag);
    expect(storedRel?.prop).toEqual('Test');
  });

  it('should delete relationship', () => {
    spectator.service.addRelationships(exampleRel);
    expect(query.getAll()).toEqual([exampleRel]);
    spectator.service.deleteRelationship(exampleRel?.$relationshipId);
    expect(query.getAll()).toEqual([]);
  });

  it('should delete relationship of twin', () => {
    spectator.service.addRelationships(exampleRel);
    expect(query.getAll()).toEqual([exampleRel]);
    spectator.service.deleteTwinRelationships(exampleRel?.$sourceId);
    expect(query.getAll()).toEqual([]);
  });

  it('should get relationships of twin', () => {
    spectator.service.addRelationships(exampleRel);
    expect(query.getRelationshipsForTwin(exampleRel.$sourceId)).toEqual([
      exampleRel,
    ]);
  });

  it('should filter relationships of twin', () => {
    spectator.service.addRelationships({ ...exampleRel, prop: 'Test' });
    expect(
      query.filterRelationships(
        exampleRel.$sourceId,
        (rel) => rel?.prop === 'Fails'
      )
    ).toEqual([]);

    expect(
      query.filterRelationships(
        exampleRel.$sourceId,
        (rel) => rel?.prop === 'Test'
      ).length
    ).toEqual(1);
  });
});
