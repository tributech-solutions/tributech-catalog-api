import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DigitalTwin, Relationship } from '@tributech/twin-api';
import { Observable } from 'rxjs';
import { TwinBuilderService } from './twin-builder.service';

@UntilDestroy()
@Component({
  selector: 'tt-twin-instance-builder',
  templateUrl: './twin-instance-builder.component.html',
  styleUrls: ['./twin-instance-builder.component.scss'],
})
export class TwinInstanceBuilderComponent implements OnInit {
  @Input() disableEditing = true;

  // When disableEditing is true only models from the whitelist can be edited
  @Input()
  modelWhitelist: string[] = [];
  // When disableEditing is true only relationships from the whitelist can be edited
  @Input()
  relationshipWhitelist: string[] = [];

  @Output() modelLoaded: EventEmitter<void> = new EventEmitter<void>();

  selectedTwin$: Observable<DigitalTwin> =
    this.twinBuilderService.selectedTwin$;
  selectedRelationships$: Observable<Relationship[]> =
    this.twinBuilderService.selectedRelationship$;
  hasSelection$: Observable<boolean> = this.twinBuilderService.hasSelection$;

  constructor(
    private router: Router,
    private twinBuilderService: TwinBuilderService
  ) {}

  ngOnInit(): void {
    this.twinBuilderService.loadModels().then(() => {
      this.modelLoaded.emit();
    });
  }

  selectTwin(twin: DigitalTwin) {
    this.twinBuilderService.selectTwin(twin);
  }

  selectRelationships(relationships: Relationship[]) {
    this.twinBuilderService.selectRelationships(relationships);
  }

  resetSelection() {
    this.twinBuilderService.resetSelection();
  }

  canEditTwin(twinModel: string) {
    if (!this.disableEditing) return true;
    // if edit is forbidden check whitelist
    return this.modelWhitelist.includes(twinModel);
  }

  canEditRelationship(relName: string) {
    if (!this.disableEditing) return true;
    // if edit is forbidden check whitelist
    return this.relationshipWhitelist.includes(relName);
  }

  saveTwin(twin: DigitalTwin | [Relationship, DigitalTwin]) {
    this.twinBuilderService.saveTwin(twin);
  }

  saveRel(rel: Relationship) {
    this.twinBuilderService.saveRel(rel);
  }
}
