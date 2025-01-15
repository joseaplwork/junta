import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { AdminSessionService, AuthService } from '@client/shared/services';

import { DialogComponent } from './dialog.component';

@Component({
  selector: 'ja-session-expired-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class SessionExpiredDialogComponent implements OnInit, OnDestroy {
  private readonly _auth = inject(AuthService);
  private readonly _session = inject(AdminSessionService);
  private readonly _dialog = inject(MatDialog);

  private _interval!: ReturnType<typeof setInterval>;
  private INTERVAL_TIME = 1000 * 60 * 5;

  open = signal(false);

  ngOnInit() {
    this._interval = setInterval(() => {
      if (this._auth.isAccessTokenExpired()) {
        this._dialog.open(DialogComponent, {
          data: {
            title: 'Session expired',
            content: 'Do you want to continue with the session?',
            primaryText: 'continue',
            secondaryText: 'cancel',
          },
        });
      }
    }, this.INTERVAL_TIME);
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }

  handleCancelClick() {
    this._session.endSessionAndRedirect();
  }

  handleContinueClick() {
    this._auth
      .refreshAccessToken()
      .pipe(take(1))
      .subscribe({
        next: () => this.open.set(false),
        error: () => new Error('Could not refresh token'),
      });
  }
}
