import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from '@tributech/digital-twin';
import { HeroHeaderModule } from '../shared/hero-header/hero-header.module';
import { InstanceOverviewComponent } from './instance-overview.component';

@NgModule({
  imports: [CommonModule, HeroHeaderModule, TableModule],
  declarations: [InstanceOverviewComponent],
})
export class InstanceOverviewModule {}
