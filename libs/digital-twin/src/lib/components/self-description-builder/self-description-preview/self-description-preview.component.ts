import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { filterNilValue } from '@datorama/akita';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SelfDescriptionQuery } from '../../../services/store/self-description/self-description.query';

@Component({
  selector: 'tt-self-description-preview',
  templateUrl: './self-description-preview.component.html',
  styleUrls: ['./self-description-preview.component.scss'],
})
export class SelfDescriptionPreviewComponent implements OnInit, OnChanges {
  @Input() id: string;

  private idChangeSubject: Subject<string> = new Subject<string>();
  preview$: Observable<string> = this.idChangeSubject.pipe(
    filterNilValue(),
    switchMap((id) => this.selfDescriptionQuery.selectDenormalized(id)),
    map((val) => JSON.stringify(val, null, 2))
  );

  constructor(private selfDescriptionQuery: SelfDescriptionQuery) {}

  ngOnInit(): void {
    this.idChangeSubject.next(this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.idChangeSubject.next(this.id);
  }
}
