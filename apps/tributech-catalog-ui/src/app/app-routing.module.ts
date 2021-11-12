import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityGuard } from '@tributech/core';
import { InstanceBuilderComponent } from './instance-builder/instance-builder.component';
import { InstanceOverviewComponent } from './instance-overview/instance-overview.component';
import { ModelBuilderComponent } from './model-builder/model-builder.component';
import { ModelOverviewComponent } from './model-overview/model-overview.component';
import { TwinModelDetailComponent } from './model-overview/twin-model-detail/twin-model-detail.component';
import { SelfDescriptionGraphComponent } from './self-description-graph/self-description-graph.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [SecurityGuard],
    children: [
      {
        path: `self-descriptions`,
        component: ModelOverviewComponent,
      },
      {
        path: `self-descriptions/:dtmi`,
        component: TwinModelDetailComponent,
      },
      {
        path: `self-description-graph`,
        component: SelfDescriptionGraphComponent,
      },
      {
        path: `twins`,
        component: InstanceOverviewComponent,
      },
      {
        path: `workspace`,
        component: InstanceBuilderComponent,
      },
      {
        path: `model-workspace`,
        component: ModelBuilderComponent,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'self-descriptions',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'disabled',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
