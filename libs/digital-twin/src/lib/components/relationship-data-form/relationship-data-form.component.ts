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
import { DigitalTwin, Relationship } from '@tributech/twin-api';
import { ModelQuery } from '../../services/store/model.query';
import { TwinQuery } from '../../services/store/twin.query';
import { DEFAULT_FIELDS_RELATION } from '../form.model';
import { convertToFormConfig } from '../form.utils';

@Component({
  selector: 'tt-relationship-data-form',
  templateUrl: './relationship-data-form.component.html',
  styleUrls: ['./relationship-data-form.component.scss'],
})
export class RelationshipDataFormComponent implements OnChanges {
  @Input() disableEditing: boolean;
  @Input() relationship: Relationship;
  @Output()
  relChanged: EventEmitter<DigitalTwin> = new EventEmitter<DigitalTwin>();

  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
    },
  };

  constructor(private modelQuery: ModelQuery, private twinQuery: TwinQuery) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.relationship || changes.hideDefaultData) {
      this.model = {};
      this.setupForm();
    }

    if (changes.disableEditing) {
      this.options = {
        formState: {
          disabled: this.disableEditing,
        },
      };
    }
  }

  onSubmit() {
    if (this.form.valid && this.relationship) {
      this.emitChanges();
    }
  }

  private setupForm() {
    const relationshipName: string = this.relationship?.$relationshipName;
    const sourceId: string = this.relationship?.$sourceId;

    if (!relationshipName) return;
    this.form = new FormGroup({});

    const sourceTwin = this.twinQuery.getTwinById(sourceId);
    const relationships =
      this.modelQuery.getTwinGraphModel(sourceTwin?.$metadata?.$model)
        ?.relationships || [];

    const selectedRelationship = relationships.find(
      (rel) => rel?.name === relationshipName
    );
    if (!selectedRelationship) return;

    this.fields = [
      ...DEFAULT_FIELDS_RELATION,
      ...convertToFormConfig(selectedRelationship?.properties),
    ];

    // delay one tick
    setTimeout(() => {
      this.form.patchValue(this.relationship);
      // We set some defaults in our form configuration, due to that we need to
      // store the latest form state as our instance state after setting the configuration.
      if (this.relationship?.$relationshipId) {
        this.emitChanges();
      }
    });
  }

  private emitChanges() {
    if (this.disableEditing) return;
    this.relChanged.emit(this.form.value);
  }
}
