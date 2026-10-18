import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core'

import {
  ConfirmDialog,
  ConfirmDialogData,
} from '@/admin/shared/components/confirm-dialog/confirm-dialog'
import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'
import { AdminSession } from '@/admin/shared/services/admin-session'
import { Dialog } from '@/admin/shared/services/dialog'

const CHECK_INTERVAL_MS = 5 * 60 * 1000

/** Every few minutes, asks an idle admin whether to keep an expired session. */
@Component({
  selector: 'ja-session-expired-watcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class SessionExpiredWatcher {
  private readonly _tokens = inject(AccessTokenManager)
  private readonly _session = inject(AdminSession)
  private readonly _dialog = inject(Dialog)

  private _prompting = false

  constructor() {
    const interval = setInterval(
      () => this._promptIfExpired(),
      CHECK_INTERVAL_MS,
    )

    inject(DestroyRef).onDestroy(() => clearInterval(interval))
  }

  private _promptIfExpired(): void {
    if (this._prompting || !this._tokens.isExpired()) return

    this._prompting = true
    this._dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(
        ConfirmDialog,
        {
          title: 'Session expired',
          message: 'Do you want to continue with the session?',
          confirmText: 'Continue',
          cancelText: 'Log out',
        },
        { disableClose: true },
      )
      .afterClosed()
      .subscribe(keepSession => {
        this._prompting = false
        void this._resolve(keepSession === true)
      })
  }

  private async _resolve(keepSession: boolean): Promise<void> {
    if (!keepSession) {
      await this._session.logout()

      return
    }

    try {
      await this._tokens.refresh()
    } catch {
      this._session.end()
    }
  }
}
