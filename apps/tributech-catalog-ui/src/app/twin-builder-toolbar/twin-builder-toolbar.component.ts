import { Component } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'tributech-twin-builder-toolbar',
  templateUrl: './twin-builder-toolbar.component.html',
  styleUrls: ['./twin-builder-toolbar.component.scss'],
})
export class TwinBuilderToolbarComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
