import { Component, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { Dialog } from '@/admin/shared/services/dialog'

import { UserState } from '../user-page-state'

import { CreateUserDialog } from './components/create-user-dialog'
import { UserCreatePayload } from './interfaces/user-create-payload'
import { CreateUser } from './services/create-user'

@Component({
  selector: 'ja-user-create-feat',
  templateUrl: './create-feat.html',
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _createUser = inject(CreateUser)
  private readonly _UserState = inject(UserState)

  readonly creating = signal(false)

  handleClick() {
    const createUserDialog =
      this._dialog.open<UserCreatePayload>(CreateUserDialog)

    createUserDialog
      .afterClosed()
      .subscribe(async (result?: UserCreatePayload) => {
        if (!result) return

        this.creating.set(true)

        try {
          const user = await this._createUser.create(result)

          this._UserState.addNewUser(user)
        } catch (error) {
          console.error('Failed to create user:', error)
        } finally {
          this.creating.set(false)
        }
      })
  }
}
