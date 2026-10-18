import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { AccountResponse, UpdateAccountRequest } from '@junta/contracts'

import { AccountsApi } from '@/admin/shared/api/accounts-api'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AccountPageState } from '../account-page-state'

import {
  UpdateAccountDialog,
  UpdateAccountDialogData,
} from './components/update-account-dialog'

@Component({
  selector: 'ja-account-update-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _accountsApi = inject(AccountsApi)
  private readonly _state = inject(AccountPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const account = this._state.updateRequest()

      if (!account) return

      this._state.requestUpdate(null)
      this._openDialog(account)
    })
  }

  private _openDialog(account: AccountResponse): void {
    this._dialog.open<UpdateAccountDialog, UpdateAccountDialogData>(
      UpdateAccountDialog,
      { account, handleSubmit: request => this._update(account.id, request) },
    )
  }

  private async _update(
    id: string,
    request: UpdateAccountRequest,
  ): Promise<boolean> {
    try {
      this._state.emitUpdated(await this._accountsApi.update(id, request))
      this._snackbar.success('Account updated')

      return true
    } catch {
      this._snackbar.error('Failed to update account')

      return false
    }
  }
}
