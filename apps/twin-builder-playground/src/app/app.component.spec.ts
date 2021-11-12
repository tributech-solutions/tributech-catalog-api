import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, TrackByPropertyModule } from '@tributech/core';
import {
  RelationshipFormModule,
  TwinBuilderService,
  TwinFormModule,
  TwinTreeModule,
} from '@tributech/digital-twin';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { AppComponent } from './app.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { TwinBuilderToolbarComponent } from './twin-builder-toolbar/twin-builder-toolbar.component';
import { TwinBuilderToolbarModule } from './twin-builder-toolbar/twin-builder-toolbar.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(TwinBuilderToolbarComponent),
        MockComponent(MainSidebarComponent),
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockModule(TwinTreeModule),
        MockModule(TwinFormModule),
        MockModule(RelationshipFormModule),
        MockModule(TwinBuilderToolbarModule),
        MockModule(TrackByPropertyModule),
      ],
      providers: [
        MockProvider(AuthService, { isDoneLoading$: EMPTY }),
        MockProvider(MatDialog),
        MockProvider(TwinBuilderService),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
