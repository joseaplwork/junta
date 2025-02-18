import { AdminSessionService, AuthService } from '@/client/shared/services'
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { take } from 'rxjs'

import { DialogComponent } from './dialog.component'

@Component({
  selector: 'ja-session-expired-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class SessionExpiredDialogComponent implements OnInit, OnDestroy {
  private readonly _auth = inject(AuthService)
  private readonly _session = inject(AdminSessionService)
  private readonly _dialog = inject(MatDialog)

  private _interval!: ReturnType<typeof setInterval>
  private _ref: MatDialogRef<DialogComponent> | undefined
  private INTERVAL_TIME = 1000 * 60 * 5

  ngOnInit() {
    let isOpened = false
    this._interval = setInterval(() => {
      if (this._auth.isAccessTokenExpired() && !isOpened) {
        this._ref = this._dialog.open(DialogComponent, {
          data: {
            title: 'Session expired',
            content: 'Do you want to continue with the session?',
            primaryText: 'continue',
            secondaryText: 'cancel',
            onClick: this.handleContinueClick,
          },
        })

        isOpened = true

        this._ref.afterClosed().subscribe(data => {
          if (!data) {
            this.handleCloseClick()
          }
          isOpened = false
        })
      }
    }, this.INTERVAL_TIME)
  }

  ngOnDestroy(): void {
    clearInterval(this._interval)
  }

  handleCloseClick = () => {
    this._session.endSessionAndRedirect()
  }

  handleContinueClick = () => {
    this._auth
      .refreshAccessToken()
      .pipe(take(1))
      .subscribe({
        next: () => this._ref?.close(true),
        error: () => new Error('Could not refresh token'),
      })
  }
}
