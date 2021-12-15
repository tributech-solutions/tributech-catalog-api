import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TwinInstance, TwinRelationship } from '@tributech/self-description';
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

  selectedTwin$: Observable<TwinInstance> =
    this.twinBuilderService.selectedTwin$;
  selectedRelationships$: Observable<TwinRelationship[]> =
    this.twinBuilderService.selectedRelationship$;
  hasSelection$: Observable<boolean> = this.twinBuilderService.hasSelection$;

  constructor(
    private router: Router,
    private twinBuilderService: TwinBuilderService
  ) {}

  ngOnInit(): void {
    this.modelLoaded.emit();
  }

  selectTwin(twin: TwinInstance) {
    this.twinBuilderService.selectTwin(twin);
  }

  selectRelationships(relationships: TwinRelationship[]) {
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

  saveTwin(twin: TwinInstance | [TwinRelationship, TwinInstance]) {
    this.twinBuilderService.saveTwin(twin);
  }

  saveRel(rel: TwinRelationship) {
    this.twinBuilderService.saveRel(rel);
  }
}
