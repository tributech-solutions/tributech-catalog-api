import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isArray } from '@datorama/akita';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SelfDescription } from '@tributech/self-description';
import { cloneDeep, isEqual, isNil, omitBy } from 'lodash';
import { SelfDescriptionFormService } from '../self-description-form.service';

@Component({
  selector: 'tt-self-description-form',
  templateUrl: './self-description-form.component.html',
  styleUrls: ['./self-description-form.component.scss'],
})
export class SelfDescriptionFormComponent implements OnChanges {
  @Input() selfDescription: SelfDescription;
  @Output() sdChanged = new EventEmitter<SelfDescription>();

  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
      errors: {},
    },
  };

  constructor(private selfDescriptionFormService: SelfDescriptionFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selfDescription) {
      this.model = {};
      this.setupForm();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const updatedTwin = omitBy({ ...this.form.value }, isNil);
      this.emitChanges(updatedTwin);
    }
  }

  private setupForm() {
    this.form = new FormGroup({});
    this.fields =
      this.selfDescriptionFormService.getFormConfigForSelfDescription(
        this.selfDescription
      );

    if (
      'extends' in this.selfDescription &&
      !isArray(this.selfDescription.extends)
    ) {
      this.selfDescription.extends = [this.selfDescription.extends];
    }
    this.model = cloneDeep(this.selfDescription);
  }

  private emitChanges(updatedSelfDescription: SelfDescription) {
    if (!isEqual(this.selfDescription, updatedSelfDescription)) {
      this.sdChanged.emit(updatedSelfDescription);
    }
  }
}
