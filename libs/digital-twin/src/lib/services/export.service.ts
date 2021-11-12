import { Injectable } from '@angular/core';
import { TwinDataModel } from '../models/data.model';
import { ModelQuery } from './store/model.query';
import { RelationshipQuery } from './store/relationship.query';
import { TwinQuery } from './store/twin.query';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(
    protected twinQuery: TwinQuery,
    protected relationshipQuery: RelationshipQuery,
    protected modelQuery: ModelQuery
  ) {}

  exportToFile() {
    this.downloadObjectAsJson(
      this.save(),
      `created-twin-${new Date().toISOString()}`
    );
  }

  save() {
    const data = new TwinDataModel();

    data.digitalTwinsGraph.digitalTwins = this.twinQuery.getAll();
    data.digitalTwinsGraph.relationships = this.relationshipQuery.getAll();
    data.digitalTwinsModels = this.modelQuery.getAll();
    return data;
  }

  downloadObjectAsJson(exportObj: any, exportName: string) {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          exportObj,
          (_, value) => {
            // only serialize none null values since Catalog-API validation doesn't allow null for properties
            if (value !== null) return value;
          },
          2
        )
      );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', exportName + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
