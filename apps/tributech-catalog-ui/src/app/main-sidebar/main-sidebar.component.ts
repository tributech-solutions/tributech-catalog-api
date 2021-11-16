import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {
  faChartLine,
  faCopy,
  faFileCode,
  faHardHat,
  faPencilRuler,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfigService } from '@tributech/core';

export interface MenuItem {
  name?: string;
  type?: string;
  icon?: IconDefinition;
  path?: string | string[];
  separator?: boolean;
  preview?: boolean;
}

@UntilDestroy()
@Component({
  selector: 'tributech-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
})
export class MainSidebarComponent {
  @ViewChild('drawerRight', { static: true }) drawerRight: MatSidenav;

  public items: MenuItem[] = [
    { separator: true },
    {
      name: 'Self-Descriptions',
      type: 'menuItem',
      icon: faHardHat,
      path: ['/self-descriptions'],
    },
    {
      name: 'Self-Descriptions Workspace',
      type: 'menuItem',
      icon: faPencilRuler,
      path: ['/model-workspace'],
    },
    {
      name: 'Self-Description Graph',
      type: 'menuItem',
      icon: faChartLine,
      path: ['/self-description-graph'],
    },
    {
      name: 'Workspace',
      type: 'menuItem',
      icon: faPencilRuler,
      path: ['/workspace'],
    },
    {
      name: 'Twins',
      type: 'menuItem',
      icon: faCopy,
      path: ['/twins'],
    },
    { separator: true },
    { separator: true },
    { separator: true },
    {
      name: 'Catalog-API',
      type: 'externalLink',
      icon: faFileCode,
      path: this.configService.endpoints.catalogApiUrl,
    },
    {
      name: 'Twin-API',
      type: 'externalLink',
      icon: faFileCode,
      path: this.configService.endpoints.twinApiUrl,
    },
    {
      name: 'Docs',
      type: 'externalLink',
      icon: faFileCode,
      path: this.configService.endpoints.documentationUrl,
    },
  ];

  expanded = false;

  constructor(public router: Router, private configService: ConfigService) {}

  linkClicked(link: MenuItem) {
    if (link.type === 'externalLink') {
      window.open(link.path as string, '_blank');
    }
  }
}
