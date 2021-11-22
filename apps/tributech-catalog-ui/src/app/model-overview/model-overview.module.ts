import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { TableModule, TwinInstanceTableModule } from '@tributech/digital-twin';
import { HeroHeaderModule } from '../shared/hero-header/hero-header.module';
import { ModelOverviewComponent } from './model-overview.component';
import { TwinModelDetailComponent } from './twin-model-detail/twin-model-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    RouterModule,
    HeroHeaderModule,
    TwinInstanceTableModule,
    MatButtonModule,
    TableModule,
  ],
  declarations: [ModelOverviewComponent, TwinModelDetailComponent],
})
export class ModelOverviewModule {}
