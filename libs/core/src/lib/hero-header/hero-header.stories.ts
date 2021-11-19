import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faIceCream } from '@fortawesome/pro-light-svg-icons';
import { moduleMetadata } from '@storybook/angular';
import { HeroHeaderComponent } from './hero-header.component';

export default {
  title: 'HeroHeader',
  decorators: [
    moduleMetadata({
      declarations: [HeroHeaderComponent],
      imports: [FontAwesomeModule],
    }),
  ],
};

export const PrimaryDefault = () => ({
  component: HeroHeaderComponent,
  props: {
    icon: faIceCream,
    label: 'header',
    description: 'This is an example text.',
  },
});
