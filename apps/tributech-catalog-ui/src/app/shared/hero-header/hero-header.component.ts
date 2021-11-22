import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'tt-hero-header',
  templateUrl: './hero-header.component.html',
  styleUrls: ['./hero-header.component.scss'],
})
export class HeroHeaderComponent {
  @Input() label: string;
  @Input() description: string;
  @Input() icon: IconDefinition;
  @Input() iconState: 'default' | 'success' | 'error' | 'warning' = 'default';
}
