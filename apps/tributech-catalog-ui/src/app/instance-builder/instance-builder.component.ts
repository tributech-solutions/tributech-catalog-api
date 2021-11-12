import { Component, OnInit } from '@angular/core';
import {
  BaseDigitalTwin,
  BasicRelationship,
  LoadService,
} from '@tributech/digital-twin';

@Component({
  selector: 'tributech-instance-builder',
  templateUrl: './instance-builder.component.html',
  styleUrls: ['./instance-builder.component.scss'],
})
export class InstanceBuilderComponent implements OnInit {
  selectedTwin: BaseDigitalTwin;
  selectedRelationships: BasicRelationship[];

  constructor(private modelLoadService: LoadService) {}

  ngOnInit(): void {
    this.modelLoadService.loadRemoteBaseModels();
  }

  twinClicked(twin: BaseDigitalTwin) {
    this.selectedRelationships = null;
    this.selectedTwin = twin;
  }

  relationshipSelected(relationships: BasicRelationship[]) {
    this.selectedTwin = null;
    this.selectedRelationships = relationships;
  }
}
