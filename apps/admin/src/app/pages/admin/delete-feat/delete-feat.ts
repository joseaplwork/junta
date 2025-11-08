import { Component, effect, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { Admin } from '@/admin/shared/interfaces/admin'
import { SnackbarService } from '@/admin/shared/services/snackbar.service'

import { AdminPageState } from '../admin-page-state'

import { DeleteAdminDialog } from './components/delete-admin-dialog'
import { AdminDelete } from './services/admin-delete'

@Component({
  selector: 'ja-admin-delete-feat',
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(MatDialog)
  private readonly _adminDelete = inject(AdminDelete)
  private readonly _snackbar = inject(SnackbarService)
  private readonly _state = inject(AdminPageState)

  constructor() {
    effect(() => {
      const admin = this._state.deleteAdmin()

      if (admin) {
        this.openDeleteDialog(admin)
      }
    })
  }

  private async openDeleteDialog(admin: Admin): Promise<void> {
    this._dialog.open(DeleteAdminDialog, {
      width: '400px',
      data: {
        admin,
        handleDelete: this._handleDelete,
      },
    })
  }

  private _handleDelete = async (admin: Admin): Promise<void> => {
    try {
      await this._adminDelete.delete(admin.id)

      this._state.emitAdminDeleted(admin)
      this._snackbar.success('Admin deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete admin')
    }
  }
}
