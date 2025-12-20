import { Component, effect, inject } from '@angular/core'

import { User } from '@/admin/shared/interfaces/user'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UserState } from '../user-page-state'

import { UpdateUserDialog } from './components/update-user-dialog'
import { UserUpdatePayload } from './interfaces/update-payload'
import { UserUpdate } from './services/user-update'

@Component({
  selector: 'ja-user-update-feat',
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _userUpdate = inject(UserUpdate)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(UserState)

  constructor() {
    effect(this._listenForUserUpdate)
  }

  private _listenForUserUpdate = () => {
    const user = this._state.updateUser()

    if (user) {
      this.openUpdateDialog(user)
      this._state.emitUpdateUser(null)
    }
  }

  private async openUpdateDialog(user: User): Promise<void> {
    this._dialog.open(UpdateUserDialog, {
      user,
      handleUpdate: this._handleUpdate,
    })
  }

  private _handleUpdate = async (
    id: string,
    updateData: UserUpdatePayload,
  ): Promise<void> => {
    try {
      const updatedUser = await this._userUpdate.update(id, updateData)

      this._state.emitUserUpdated(updatedUser)
      this._snackbar.success('User updated successfully')
    } catch {
      this._snackbar.error('Failed to update user')
    }
  }
}
