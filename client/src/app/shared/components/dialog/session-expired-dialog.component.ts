import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { take } from 'rxjs';

import {
  AdminSessionService,
  AuthService,
  NavigationService,
} from '@client/shared/services';

import { DialogComponent } from './dialog.component';

@Component({
  selector: 'ja-session-expired-dialog',
  imports: [DialogComponent],
  template: `<ja-dialog
    [open]="open()"
    title="Session expired"
    content="Do you want to continue with the session?"
    primaryText="continue"
    secondaryText="cancel"
    (primaryClick)="handleContinueClick()"
    (secondaryClick)="handleCancelClick()"
    (oncancel)="handleCancelClick()">
  </ja-dialog>`,
})
export class SessionExpiredDialogComponent implements OnInit, OnDestroy {
  private _interval!: ReturnType<typeof setInterval>;

  private INTERVAL_TIME = 1000 * 60 * 5;

  open = signal(false);

  constructor(
    public nav: NavigationService,
    private _auth: AuthService,
    private _session: AdminSessionService,
  ) {}

  ngOnInit() {
    this._interval = setInterval(() => {
      if (this._auth.isAccessTokenExpired()) {
        this.open.set(true);
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
