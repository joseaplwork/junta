import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { take } from 'rxjs'

import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'
import { AdminSession } from '@/admin/shared/services/admin-session'

import { Dialog } from './dialog'

@Component({
  selector: 'ja-session-expired-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class SessionExpiredDialog implements OnInit, OnDestroy {
  private readonly _auth = inject(AccessTokenManager)
  private readonly _session = inject(AdminSession)
  private readonly _dialog = inject(MatDialog)

  private _interval!: ReturnType<typeof setInterval>
  private _ref: MatDialogRef<Dialog> | undefined
  private INTERVAL_TIME = 1000 * 60 * 5

  ngOnInit() {
    let isOpened = false

    this._interval = setInterval(() => {
      if (this._auth.isAccessTokenExpired() && !isOpened) {
        this._ref = this._dialog.open(Dialog, {
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
