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
import {
  BaseDigitalTwin,
  SchemaValidationError,
  ValidationService,
} from '@tributech/catalog-api';
import { DialogService } from '@tributech/core';
import { DigitalTwin } from '@tributech/twin-api';
import { isEqual, isNil, omitBy } from 'lodash';
import { Observable } from 'rxjs';
import { ModelQuery } from '../../services/store/model.query';
import { DEFAULT_FIELDS_TWIN, DEFAULT_FIELDS_TWIN_HIDDEN } from '../form.model';
import { convertToFormConfig } from '../form.utils';

@Component({
  selector: 'tt-twin-data-form',
  templateUrl: './twin-data-form.component.html',
  styleUrls: ['./twin-data-form.component.scss'],
})
export class TwinDataFormComponent implements OnChanges {
  @Input() disableEditing: boolean;
  @Input() hideDefaultData = false;
  @Input() twin: DigitalTwin;
  @Output() twinChanged: EventEmitter<DigitalTwin> =
    new EventEmitter<DigitalTwin>();

  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
      errors: {},
    },
  };

  constructor(
    private modelQuery: ModelQuery,
    private validationService: ValidationService,
    private dialogService: DialogService
  ) {}

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

      this.validateTwin(updatedTwin)
        .toPromise()
        .then((result: SchemaValidationError) => {
          if (result?.success) {
            this.emitChanges(updatedTwin);
          } else {
            this.dialogService.openValidationErrorModal(result);
          }
        });
    }
  }

  private setupForm() {
    const modelId: string = this.twin?.$metadata?.$model;

    if (!modelId) return;
    this.form = new FormGroup({});

    const twinSchema = this.modelQuery.getTwinGraphModel(modelId);
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

  private emitChanges(updatedTwin: DigitalTwin) {
    if (this.disableEditing) return;
    if (!isEqual(this.twin, updatedTwin)) {
      this.twinChanged.emit(updatedTwin);
    }
  }

  private validateTwin(
    updatedTwin: DigitalTwin
  ): Observable<SchemaValidationError> {
    return this.validationService.validationControllerValidateInstance(
      updatedTwin as BaseDigitalTwin
    );
  }
}
