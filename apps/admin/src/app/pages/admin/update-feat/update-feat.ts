import { Component, effect, inject } from '@angular/core'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import { UpdateAdminDialog } from './components/update-admin-dialog'
import { AdminUpdateDto } from './interfaces/admin-update-dto'
import { AdminUpdate } from './services/update-admin'

@Component({
  selector: 'ja-admin-update-feat',
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _adminUpdate = inject(AdminUpdate)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(AdminPageState)

  constructor() {
    effect(this._listerForAdminUpdate)
  }

  private _listerForAdminUpdate = () => {
    const admin = this._state.updateAdmin()

    if (admin) {
      this.openUpdateDialog(admin)
      this._state.emitUpdateAdmin(null)
    }
  }

  private async openUpdateDialog(admin: Admin): Promise<void> {
    this._dialog.open(UpdateAdminDialog, {
      admin,
      handleUpdate: this._handleUpdate,
    })
  }

  private _handleUpdate = async (
    id: string,
    updateData: AdminUpdateDto,
  ): Promise<void> => {
    try {
      const updatedAdmin = await this._adminUpdate.update(id, updateData)

      this._state.emitAdminUpdated(updatedAdmin)
      this._snackbar.success('Admin updated successfully')
    } catch {
      this._snackbar.error('Failed to update admin')
    }
  }
}
