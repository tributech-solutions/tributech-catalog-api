import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TwinInstance } from '@tributech/self-description';
import { isEqual, isNil, omitBy } from 'lodash';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';
import {
  DEFAULT_FIELDS_TWIN,
  DEFAULT_FIELDS_TWIN_HIDDEN,
} from './form-configs/form.model';
import { convertToFormConfig } from './form-configs/form.utils';

@Component({
  selector: 'tt-twin-data-form',
  templateUrl: './twin-data-form.component.html',
  styleUrls: ['./twin-data-form.component.scss'],
})
export class TwinDataFormComponent implements OnChanges {
  @Input() disableEditing: boolean;
  @Input() hideDefaultData = false;
  @Input() twin: TwinInstance;
  @Output() twinChanged: EventEmitter<TwinInstance> =
    new EventEmitter<TwinInstance>();

  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
      errors: {},
    },
  };

  constructor(private selfDescriptionQuery: SelfDescriptionQuery) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.twin || changes.hideDefaultData) {
      this.model = {};
      this.setupForm();
    }

    if (changes.disableEditing) {
      this.options = {
        formState: {
          disabled: this.disableEditing,
          errors: {},
        },
      };
    }
  }

  onSubmit() {
    if (this.form.valid && this.twin) {
      const updatedTwin = omitBy({ ...this.twin, ...this.form.value }, isNil);
      this.emitChanges(updatedTwin);
    }
  }

  private setupForm() {
    const modelId: string = this.twin?.$metadata?.$model;

    if (!modelId) return;
    this.form = new FormGroup({});

    const twinSchema = this.selfDescriptionQuery.getTwinGraphModel(modelId);
    const properties = twinSchema?.properties;

    this.fields = [
      ...(this.hideDefaultData
        ? DEFAULT_FIELDS_TWIN_HIDDEN
        : DEFAULT_FIELDS_TWIN),
      ...convertToFormConfig(properties, twinSchema),
    ];

    // delay one tick
    setTimeout(() => {
      this.form.patchValue(this.twin);
      // We set some defaults in our form configuration, due to that we need to
      // store the latest form state as our instance state after setting the configuration.
      if (this.twin?.$dtId) {
        const updatedTwin = omitBy({ ...this.twin, ...this.form.value }, isNil);
        this.emitChanges(updatedTwin);
      }
    });
  }

  private emitChanges(updatedTwin: TwinInstance) {
    if (this.disableEditing) return;
    if (!isEqual(this.twin, updatedTwin)) {
      this.twinChanged.emit(updatedTwin);
    }
  }
}
