import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UserState } from '../user-page-state'

import { CreateUserDialog } from './components/create-user-dialog'
import { UserCreatePayload } from './interfaces/create-payload'
import { CreateUser } from './services/create-user'

@Component({
  selector: 'ja-user-create-feat',
  templateUrl: './create-feat.html',
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _createUser = inject(CreateUser)
  private readonly _state = inject(UserState)
  private readonly _snackbar = inject(Snackbar)

  handleClick(): void {
    this._dialog.open(CreateUserDialog, { handleSubmit: this._handleSubmit })
  }

  private _handleSubmit = async (
    formData: UserCreatePayload,
  ): Promise<void> => {
    try {
      const user = await this._createUser.create(formData)

      this._state.emitUserCreated(user)
      this._snackbar.success('User created successfully')
    } catch {
      this._snackbar.error('Failed to create user')
    }
  }
}
