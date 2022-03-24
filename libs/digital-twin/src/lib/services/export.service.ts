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

  exportToFile(withModels: boolean = false) {
    this.downloadObjectAsJson(
      this.save(withModels),
      `twin-graph-${new Date().toISOString()}`
    );
  }

  exportAsTemplateToFile() {
    const data = this.getCurrentGraphAsTemplate();
    this.downloadObjectAsJson(
      data,
      `twin-template-${new Date().toISOString()}`
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

  getCurrentGraphAsTemplate() {
    const rootTwin = this.twinQuery.getRootTwin();
    const data = new TwinFileModel();

    data.digitalTwinsGraph.digitalTwins = this.twinQuery.getAll();
    data.digitalTwinsGraph.relationships = this.relationshipQuery.getAll();

    const replaceDtIds = data.digitalTwinsGraph.digitalTwins.map(
      (t) => t.$dtId
    );
    const replaceValueMetadataId = data.digitalTwinsGraph.digitalTwins
      .map((t) => t.ValueMetadataId)
      .filter((s) => s);

    const replacementHashMap: Map<string, string> = new Map<string, string>();

    replaceDtIds.forEach((dtid, index) => {
      if (dtid === rootTwin.$dtId) {
        replacementHashMap.set(dtid, '$$root_uuid$$');
      } else {
        replacementHashMap.set(dtid, `$$uuid${index}$$`);
      }
    });

    replaceValueMetadataId.forEach((id) => {
      if (!replacementHashMap.has(id)) {
        replacementHashMap.set(id, '$$random_uuid$$');
      }
    });

    let exportData = JSON.stringify(data);
    for (const [key, value] of replacementHashMap) {
      exportData = this.replaceAll(exportData, key, value);
    }

    return JSON.parse(exportData);
  }

  replaceAll(str: string, find: string, replace: string): string {
    return str.split(find).join(replace);
  }
}
