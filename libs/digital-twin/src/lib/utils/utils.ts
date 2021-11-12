import { uuidv4 } from '@tributech/core';
import { RelationType } from '../models/constants';
import {
  BaseDigitalTwin,
  BasicRelationship,
  DigitalTwinModel,
} from '../models/data.model';

export function createEmptyTwin(modelId: string): BaseDigitalTwin {
  return {
    $dtId: uuidv4(),
    $etag: createETag(),
    $metadata: {
      $model: modelId,
    },
  };
}

export function createEmptyRelationship(
  relationshipName: string,
  sourceId: string,
  targetId: string
): BasicRelationship {
  return {
    $relationshipId: uuidv4(),
    $etag: createETag(),
    $sourceId: sourceId,
    $relationshipName: relationshipName,
    $targetId: targetId,
  };
}

export function createETag() {
  return `W/"${uuidv4()}"`;
}

export function filterRelType(
  rel: BasicRelationship,
  twinId: string,
  relationshipType: RelationType
): boolean {
  switch (relationshipType) {
    case RelationType.All:
      return rel?.$sourceId === twinId || rel?.$targetId === twinId;
    case RelationType.Source:
      return rel?.$sourceId === twinId;
    case RelationType.Target:
      return rel?.$targetId === twinId;
  }
}

export function ensureIsValidTwinFile(data: any): data is DigitalTwinModel {
  return !!data?.digitalTwins && !!data?.relationships;
}

export function mapToRelevantData(data: any): DigitalTwinModel {
  return ensureIsValidTwinFile(data) ? data : data?.digitalTwinsGraph;
}

export function isValidModel(data: any) {
  return !!data?.['@context'] && !!data?.['@id'] && !!data?.['@type'];
}

export function convertDTMIToNeo4jLabel(dtmi: string): string {
  // eslint-disable-next-line prefer-const
  let [_dtmi, _version] = dtmi?.replace('dtmi:', '').split(';');
  _dtmi = _dtmi.split('_').map(capitalizeFirstLetter).join('');
  const reversedDTMI = _dtmi?.split(':').reverse().map(capitalizeFirstLetter);

  return `${reversedDTMI?.join('')}V${_version}`;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
