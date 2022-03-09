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

  saveTwin(twin: TwinInstance | [TwinRelationship, TwinInstance]) {
    this.twinBuilderService.saveTwin(twin);
  }

  saveRel(rel: TwinRelationship) {
    this.twinBuilderService.saveRel(rel);
  }
}
