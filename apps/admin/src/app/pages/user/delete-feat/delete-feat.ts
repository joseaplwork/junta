import { Component, effect, inject } from '@angular/core'

import { User } from '@/admin/shared/interfaces/user'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UserState } from '../user-page-state'

import { DeleteUserDialog } from './components/delete-user-dialog'
import { UserDelete } from './services/user-delete'

@Component({
  selector: 'ja-user-delete-feat',
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _userDelete = inject(UserDelete)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(UserState)

  constructor() {
    effect(this.listenForUserDelete)
  }

  private listenForUserDelete = () => {
    const user = this._state.deleteUser()

    if (user) {
      this.openDeleteDialog(user)
      this._state.emitDeleteUser(null)
    }
  }

  private async openDeleteDialog(user: User): Promise<void> {
    this._dialog.open(DeleteUserDialog, {
      user,
      handleDelete: this._handleDelete,
    })
  }

  private _handleDelete = async (user: User): Promise<void> => {
    try {
      await this._userDelete.delete(user.id)

      this._state.emitUserDeleted(user)
      this._snackbar.success('User deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete user')
    }
  }
}
