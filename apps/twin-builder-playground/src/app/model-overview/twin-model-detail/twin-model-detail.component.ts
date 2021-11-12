import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filterNilValue } from '@datorama/akita';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { DtdlModelsService, ExpandedInterface } from '@tributech/catalog-api';
import { createEmptyTwin, TwinBuilderService } from '@tributech/digital-twin';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'tributech-twin-model-detail',
  templateUrl: './twin-model-detail.component.html',
  styleUrls: ['./twin-model-detail.component.scss'],
})
export class TwinModelDetailComponent implements OnInit {
  model$: Observable<ExpandedInterface>;
  faInfo = faInfo;

  constructor(
    private activatedRouter: ActivatedRoute,
    private dtdlModelsService: DtdlModelsService,
    private twinBuilderService: TwinBuilderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.model$ = this.activatedRouter.paramMap.pipe(
      switchMap((params) => {
        const dtmi = params.get('dtmi');
        return this.dtdlModelsService.getExpanded(dtmi).pipe(filterNilValue());
      })
    );
  }

  editTwin(dtid: string) {
    this.router.navigate(['/workspace']).then(() => {
      this.twinBuilderService.clearAndLoad(dtid);
    });
  }

  async createTwin(dtmi: string) {
    if (!dtmi) return;
    const newTwin = createEmptyTwin(dtmi);
    await this.router.navigate(['/workspace']);
    this.twinBuilderService.clearLoadedTwins();
    await this.twinBuilderService.saveTwin(newTwin);
    this.twinBuilderService.selectTwin(newTwin);
  }
}
