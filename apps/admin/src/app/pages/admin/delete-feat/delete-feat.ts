import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { AdminResponse } from '@junta/contracts'

import { AdminsApi } from '@/admin/shared/api/admins-api'
import {
  CrudDeleteDialog,
  DeleteDialogData,
} from '@/admin/shared/components/crud'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

@Component({
  selector: 'ja-admin-delete-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _adminsApi = inject(AdminsApi)
  private readonly _state = inject(AdminPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const admin = this._state.deleteRequest()

      if (!admin) return

      this._state.requestDelete(null)
      this._openDialog(admin)
    })
  }

  private _openDialog(admin: AdminResponse): void {
    this._dialog.open<CrudDeleteDialog, DeleteDialogData>(CrudDeleteDialog, {
      entityName: 'Admin',
      displayName: admin.email,
      handleDelete: () => this._delete(admin),
    })
  }

  private async _delete(admin: AdminResponse): Promise<boolean> {
    try {
      await this._adminsApi.remove(admin.id)
      this._state.emitDeleted(admin)
      this._snackbar.success('Admin deleted')

      return true
    } catch {
      this._snackbar.error('Failed to delete admin')

      return false
    }
  }
}
