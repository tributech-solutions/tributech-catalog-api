import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar/snack-bar-config';
import { SchemaValidationError } from '@tributech/catalog-api';
import { LoadingComponent } from '../loading/loading.component';
import { SchemaValidationErrorComponent } from '../schema-validation-errors/schema-validation-error.component';
import { ValidationErrorComponent } from '../validation-errors/validation-error.component';
import { DynamicDialogComponent } from './dynamic-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog, private snackbar: MatSnackBar) {}

  private defaultConfig = { height: 'auto', width: '70%', autoFocus: true };

  open<T>(
    component: Type<T>,
    data?: { [key: string]: unknown },
    overrides?: MatDialogConfig
  ) {
    return this.dialog.open(DynamicDialogComponent, {
      ...this.defaultConfig,
      ...overrides,
      data: {
        component,
        inputs: data,
      },
    });
  }

  openErrorModal(error: SchemaValidationError | any) {
    return this.open(ValidationErrorComponent, { error });
  }

  openValidationErrorModal(error: SchemaValidationError | any) {
    return this.open(SchemaValidationErrorComponent, { error });
  }

  openLoadingModal(message: string, subtitle?: string) {
    return this.open(
      LoadingComponent,
      { message, subtitle },
      { disableClose: true, width: '400px' }
    );
  }

  triggerSnackbar(
    message: string,
    action: string = 'Close',
    config?: MatSnackBarConfig
  ) {
    this.snackbar.open(message, action, {
      duration: 3000,
      ...config,
    });
  }

  triggerComponentSnackbar<T>(
    component: Type<T>,
    data: { [key: string]: unknown } = {},
    config?: MatSnackBarConfig
  ) {
    this.snackbar.openFromComponent(component, {
      duration: 3000,
      data,
      ...config,
    });
  }
}
