import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeroHeaderModule, TableModule } from '@tributech/core';
import { InstanceOverviewComponent } from './instance-overview.component';

@NgModule({
  imports: [CommonModule, HeroHeaderModule, TableModule],
  declarations: [InstanceOverviewComponent],
})
export class InstanceOverviewModule {}
