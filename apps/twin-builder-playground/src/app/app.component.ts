import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService, DialogService } from '@tributech/core';
import { TwinBuilderService } from '@tributech/digital-twin';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'tributech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = true;
  preloadedImages = [];
  loadingDialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private twinBuilderService: TwinBuilderService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.imagePreload('/assets/logo/logo_white.svg');

    const sub = this.authService.isDoneLoading$
      .pipe(
        filter((ready) => ready),
        switchMap(() => this.authService.isAuthenticated$)
      )
      .subscribe((authorized) => {
        if (authorized) {
          this.loadingDialogRef.close();
          this.isLoading = false;
          this.twinBuilderService.loadModels();
          sub.unsubscribe();
        } else {
          setTimeout(() => this.authService.login());
        }
      });

    this.showLoadingSpinner();
  }

  showLoadingSpinner() {
    this.loadingDialogRef = this.dialogService.openLoadingModal('Loading...');
  }

  private imagePreload(...args: string[]): void {
    for (let i = 0; i < args.length; i++) {
      this.preloadedImages[i] = new Image();
      this.preloadedImages[i].src = args[i];
    }
  }
}
