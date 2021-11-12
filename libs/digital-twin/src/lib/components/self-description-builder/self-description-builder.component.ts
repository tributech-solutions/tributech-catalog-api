import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelfDescription } from '../../models/data.model';
import { SelfDescriptionService } from '../../services/store/self-description/self-description.service';
import { CreateNewSelfDescriptionPayload } from './self-description-tree/self-description-tree.component';

@Component({
  selector: 'tt-self-description-builder',
  templateUrl: './self-description-builder.component.html',
  styleUrls: ['./self-description-builder.component.scss'],
})
export class SelfDescriptionBuilderComponent {
  selectedSelfDescription: SelfDescription;
  createdSelfDescription: CreateNewSelfDescriptionPayload;

  constructor(
    private router: Router,
    private selfDescriptionService: SelfDescriptionService
  ) {}

  sdSelectionChanged(selfDescription: SelfDescription) {
    this.selectedSelfDescription = selfDescription;
    this.createdSelfDescription = null;
  }

  sdCreated(payload: CreateNewSelfDescriptionPayload) {
    this.selectedSelfDescription = null;
    this.createdSelfDescription = payload;
  }

  sdChanged(sd: SelfDescription) {
    if (this.createdSelfDescription) {
      if (this.createdSelfDescription.anchorSD) {
        this.selfDescriptionService.addAndLink(
          this.createdSelfDescription.anchorSD,
          sd,
          this.createdSelfDescription.targetProp
        );
      } else {
        this.selfDescriptionService.add([sd]);
      }
    } else {
      this.selfDescriptionService.update(sd);
    }
  }

  clearSelection() {
    this.selectedSelfDescription = null;
    this.createdSelfDescription = null;
  }
}
