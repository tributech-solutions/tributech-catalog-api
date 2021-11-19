import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

/**
 * BASED ON https://stackblitz.com/edit/angular-table-resize
 */
@Directive({
  selector: '[ttResizeColumn]',
})
export class ResizeColumnDirective implements OnInit {
  // Whether column need resizing or not
  @Input() resizable: boolean;
  @Input() index: number;
  private startX: number;
  private startWidth: number;
  private readonly column: HTMLElement;
  private table: HTMLElement;
  private pressed: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);
      // we will add this element as a marker for triggering resize.
      const resizer = this.renderer.createElement('span');
      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
      this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
      this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, 'resizing');
      // Calculate width of column
      const width = this.startWidth + (event.pageX - this.startX - offset);
      const tableCells = Array.from(
        this.table.querySelectorAll('.mat-row')
      ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index));
      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${width}px`);
      // Set table cells width
      for (const cell of tableCells) {
        this.renderer.setStyle(cell, 'width', `${width}px`);
      }
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };
}
