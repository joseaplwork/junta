import { Component, effect, inject } from '@angular/core'

import { CrudDeleteDialog } from '@/admin/shared/components/crud'
import { Admin } from '@/admin/shared/interfaces/admin'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import { AdminDelete } from './services/admin-delete'

@Component({
  selector: 'ja-admin-delete-feat',
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _adminDelete = inject(AdminDelete)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(AdminPageState)

  private _currentAdmin: Admin | null = null

  constructor() {
    effect(this._listenForAdminDelete)
  }

  private _listenForAdminDelete = () => {
    const admin = this._state.deleteAdmin()

    if (admin) {
      this._openDeleteDialog(admin)
    }
  }

  private _openDeleteDialog(admin: Admin): void {
    this._currentAdmin = admin

    this._dialog.open(CrudDeleteDialog, {
      entityName: 'Admin',
      displayName: admin.email,
      handleDelete: this._handleDelete,
    })
  }

  private _handleDelete = async (): Promise<void> => {
    if (!this._currentAdmin) return

    try {
      await this._adminDelete.delete(this._currentAdmin.id)

      this._state.emitAdminDeleted(this._currentAdmin)
      this._snackbar.success('Admin deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete admin')
      throw new Error('Delete failed')
    } finally {
      this._state.emitDeleteAdmin(null)
    }
  }
}
