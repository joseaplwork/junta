import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { CreateAccountRequest } from '@junta/contracts'

import { AccountsApi } from '@/admin/shared/api/accounts-api'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AccountPageState } from '../account-page-state'

import {
  CreateAccountDialog,
  CreateAccountDialogData,
} from './components/create-account-dialog'

@Component({
  selector: 'ja-account-create-feat',
  templateUrl: './create-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _accountsApi = inject(AccountsApi)
  private readonly _state = inject(AccountPageState)
  private readonly _snackbar = inject(Snackbar)

  openDialog(): void {
    this._dialog.open<CreateAccountDialog, CreateAccountDialogData>(
      CreateAccountDialog,
      { handleSubmit: request => this._create(request) },
    )
  }

  private async _create(request: CreateAccountRequest): Promise<boolean> {
    try {
      this._state.emitCreated(await this._accountsApi.create(request))
      this._snackbar.success('Account created')

      return true
    } catch {
      this._snackbar.error('Failed to create account')

      return false
    }
  }
}
