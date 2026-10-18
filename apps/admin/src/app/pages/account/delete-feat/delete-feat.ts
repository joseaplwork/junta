import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { AccountResponse } from '@junta/contracts'

import { AccountsApi } from '@/admin/shared/api/accounts-api'
import {
  CrudDeleteDialog,
  DeleteDialogData,
} from '@/admin/shared/components/crud'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AccountPageState } from '../account-page-state'

@Component({
  selector: 'ja-account-delete-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _accountsApi = inject(AccountsApi)
  private readonly _state = inject(AccountPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const account = this._state.deleteRequest()

      if (!account) return

      this._state.requestDelete(null)
      this._openDialog(account)
    })
  }

  private _openDialog(account: AccountResponse): void {
    this._dialog.open<CrudDeleteDialog, DeleteDialogData>(CrudDeleteDialog, {
      entityName: 'Account',
      displayName: account.email,
      handleDelete: () => this._delete(account),
    })
  }

  private async _delete(account: AccountResponse): Promise<boolean> {
    try {
      await this._accountsApi.remove(account.id)
      this._state.emitDeleted(account)
      this._snackbar.success('Account deleted')

      return true
    } catch {
      this._snackbar.error('Failed to delete account')

      return false
    }
  }
}
