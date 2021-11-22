import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrackByPropertyModule } from '../track-by-propery/track-by-property.module';
import { ResizeColumnDirective } from './directives/resize-column.directive';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    TrackByPropertyModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    FontAwesomeModule,
  ],
  declarations: [TableComponent, ResizeColumnDirective],
  exports: [TableComponent],
})
export class TableModule {}
