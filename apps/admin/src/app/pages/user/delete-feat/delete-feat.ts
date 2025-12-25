import { Component, effect, inject } from '@angular/core'

import { CrudDeleteDialog } from '@/admin/shared/components/crud'
import { User } from '@/admin/shared/interfaces/user'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UserState } from '../user-page-state'

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

  private _currentUser: User | null = null

  constructor() {
    effect(this._listenForUserDelete)
  }

  private _listenForUserDelete = () => {
    const user = this._state.deleteUser()

    if (user) {
      this._openDeleteDialog(user)
      this._state.emitDeleteUser(null)
    }
  }

  private _openDeleteDialog(user: User): void {
    this._currentUser = user

    this._dialog.open(CrudDeleteDialog, {
      entityName: 'User',
      displayName: `${user.name} ${user.surname}`,
      handleDelete: this._handleDelete,
    })
  }

  private _handleDelete = async (): Promise<void> => {
    if (!this._currentUser) return

    try {
      await this._userDelete.delete(this._currentUser.id)

      this._state.emitUserDeleted(this._currentUser)
      this._snackbar.success('User deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete user')
    }
  }
}
