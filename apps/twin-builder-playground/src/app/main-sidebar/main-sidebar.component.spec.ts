import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ConcealedInTrialModule,
  ConfigService,
  MockConfigService,
  NotificationService,
  TrackByPropertyModule,
} from '@tributech/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { MainSidebarComponent } from './main-sidebar.component';

describe('MainSidebarComponent', () => {
  let component: MainSidebarComponent;
  let fixture: ComponentFixture<MainSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(FontAwesomeModule),
        MockModule(MatSidenavModule),
        HttpClientTestingModule,
        NoopAnimationsModule,
        MockModule(MatIconModule),
        MockModule(ConcealedInTrialModule),
        MockModule(TrackByPropertyModule),
        MockModule(MatListModule),
      ],
      declarations: [MainSidebarComponent],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        MockProvider(NotificationService),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
