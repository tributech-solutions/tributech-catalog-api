import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeroHeaderComponent } from './hero-header.component';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [HeroHeaderComponent],
  exports: [HeroHeaderComponent],
})
export class HeroHeaderModule {}
