import { moduleMetadata } from '@storybook/angular';
import { ValidationErrorComponent } from './validation-error.component';
import { ValidationErrorModule } from './validation-error.module';

export default {
  title: 'Validation Error',
  decorators: [
    moduleMetadata({
      imports: [ValidationErrorModule],
    }),
  ],
};

export const PrimaryDefault = () => ({
  component: ValidationErrorComponent,
  props: {
    error: {
      type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
      title: 'One or more validation errors occurred.',
      status: 400,
      errors: {
        MetadataApi: [
          // eslint-disable-next-line max-len
          `Can not edit existing data of ValueSchema (id '70c562cd-063c-4cc1-a9a8-3e868dd057f9') referencing ValueMetadatas with active Publication.`,
        ],
      },
    },
  },
});
