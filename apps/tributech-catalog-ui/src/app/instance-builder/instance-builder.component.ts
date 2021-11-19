import { Component, OnInit } from '@angular/core';
import { LoadService } from '@tributech/digital-twin';
import { TwinInstance, TwinRelationship } from '@tributech/self-description';

@Component({
  selector: 'tributech-instance-builder',
  templateUrl: './instance-builder.component.html',
  styleUrls: ['./instance-builder.component.scss'],
})
export class InstanceBuilderComponent implements OnInit {
  selectedTwin: TwinInstance;
  selectedRelationships: TwinRelationship[];

  constructor(private modelLoadService: LoadService) {}

  ngOnInit(): void {
    this.modelLoadService.loadRemoteBaseModels();
  }

  twinClicked(twin: TwinInstance) {
    this.selectedRelationships = null;
    this.selectedTwin = twin;
  }

  relationshipSelected(relationships: TwinRelationship[]) {
    this.selectedTwin = null;
    this.selectedRelationships = relationships;
  }
}
