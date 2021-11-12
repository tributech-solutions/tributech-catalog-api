import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {
  faChartLine,
  faCopy,
  faFileCode,
  faHardHat,
  faPencilRuler,
} from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ConfigService,
  MenuItem,
  MessageBrokerMessage,
  MessageBrokerService,
  NavigationService,
} from '@tributech/core';

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

  constructor(
    public router: Router,
    public navigationService: NavigationService,
    private messageBroker: MessageBrokerService,
    private configService: ConfigService
  ) {
    this.messageBroker
      .getBroker()
      .pipe(untilDestroyed(this))
      .subscribe((message: MessageBrokerMessage<string>) => {
        if (
          message.sender === 'mainToolbarComponent' &&
          message.data === 'toggle'
        ) {
          this.drawerRight.toggle();
        }
      });
  }

  linkClicked(link: MenuItem) {
    if (link.type === 'externalLink') {
      window.open(link.path as string, '_blank');
    }
  }
}