import { Component, effect, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { Admin } from '@/admin/shared/interfaces/admin'

import { AdminPageState } from '../admin-page-state'

import { UpdateAdminDialog } from './components/update-admin-dialog'
import { AdminUpdateDto } from './interfaces/admin-update-dto'
import { AdminUpdate } from './services/update-admin'

@Component({
  selector: 'ja-admin-update-feat',
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(MatDialog)
  private readonly _adminUpdate = inject(AdminUpdate)
  private readonly _snackBar = inject(MatSnackBar)
  private readonly _state = inject(AdminPageState)

  constructor() {
    effect(() => {
      const admin = this._state.updateAdmin()

      if (admin) {
        this.openUpdateDialog(admin)
      }
    })
  }

  private async openUpdateDialog(admin: Admin): Promise<void> {
    this._dialog.open(UpdateAdminDialog, {
      width: '500px',
      data: {
        admin,
        handleUpdate: this._handleUpdate,
      },
    })
  }

  private _handleUpdate = async (
    id: string,
    updateData: AdminUpdateDto,
  ): Promise<void> => {
    try {
      const updatedAdmin = await this._adminUpdate.update(id, updateData)

      this._state.emitAdminUpdated(updatedAdmin)
      this._snackBar.open('Admin updated successfully', 'Close', {
        duration: 3000,
      })
    } catch {
      this._snackBar.open('Failed to update admin', 'Close', {
        duration: 3000,
      })
    }
  }
}
