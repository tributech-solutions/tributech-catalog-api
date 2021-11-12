import { Inject, Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { TRIAL_MODE } from '../../config/config.service';

@Injectable({ providedIn: 'root' })
export class TrialGuard implements CanLoad {
  constructor(@Inject(TRIAL_MODE) public inTrialMode: boolean) {}

  canLoad(): boolean {
    return !this.inTrialMode;
  }
}
