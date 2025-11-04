import { Component, effect, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { Admin } from '@/admin/shared/interfaces/admin'

import { AdminPageState } from '../admin-page-state'

import { DeleteAdminDialog } from './components/delete-admin-dialog'
import { AdminDelete } from './services/admin-delete'

@Component({
  selector: 'ja-admin-delete-ft',
  template: '',
})
export class DeleteFeature {
  private readonly _dialog = inject(MatDialog)
  private readonly _adminDelete = inject(AdminDelete)
  private readonly _snackBar = inject(MatSnackBar)
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
      this._snackBar.open('Admin deleted successfully', 'Close', {
        duration: 3000,
      })
    } catch {
      this._snackBar.open('Failed to delete admin', 'Close', {
        duration: 3000,
      })
    }
  }
}
