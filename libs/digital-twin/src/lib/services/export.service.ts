import { Injectable } from '@angular/core';
import { TwinFileModel } from '@tributech/self-description';
import { RelationshipQuery } from './store/relationship/relationship.query';
import { SelfDescriptionQuery } from './store/self-description/self-description.query';
import { TwinQuery } from './store/twin-instance/twin.query';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(
    protected twinQuery: TwinQuery,
    protected relationshipQuery: RelationshipQuery,
    protected selfDescriptionQuery: SelfDescriptionQuery
  ) {}

  exportToFile(withModels: boolean = true) {
    this.downloadObjectAsJson(
      this.save(withModels),
      `created-twin-${new Date().toISOString()}`
    );
  }

  save(withModels: boolean = true) {
    const data = new TwinFileModel();

    data.digitalTwinsGraph.digitalTwins = this.twinQuery.getAll();
    data.digitalTwinsGraph.relationships = this.relationshipQuery.getAll();
    if (withModels) {
      data.digitalTwinsModels = this.selfDescriptionQuery.getAllInterfaces();
    }
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
