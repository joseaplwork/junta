import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { AdminResponse, UpdateAdminRequest } from '@junta/contracts'

import { AdminsApi } from '@/admin/shared/api/admins-api'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import {
  UpdateAdminDialog,
  UpdateAdminDialogData,
} from './components/update-admin-dialog'

@Component({
  selector: 'ja-admin-update-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _adminsApi = inject(AdminsApi)
  private readonly _state = inject(AdminPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const admin = this._state.updateRequest()

      if (!admin) return

      this._state.requestUpdate(null)
      this._openDialog(admin)
    })
  }

  private _openDialog(admin: AdminResponse): void {
    this._dialog.open<UpdateAdminDialog, UpdateAdminDialogData>(
      UpdateAdminDialog,
      { admin, handleSubmit: request => this._update(admin.id, request) },
    )
  }

  private async _update(
    id: string,
    request: UpdateAdminRequest,
  ): Promise<boolean> {
    try {
      this._state.emitUpdated(await this._adminsApi.update(id, request))
      this._snackbar.success('Admin updated')

      return true
    } catch {
      this._snackbar.error('Failed to update admin')

      return false
    }
  }
}
