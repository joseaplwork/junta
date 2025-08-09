import { Component, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'

import { UserState } from '../user-page-state'

import { CreateUserDialog } from './components/create-user-dialog'
import { UserCreatePayload } from './interfaces/user-create-payload'
import { CreateUser } from './services/create-user'

@Component({
  selector: 'app-users-create-feature',
  templateUrl: './create-feature.html',
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
})
export class CreateFeature {
  private readonly _dialog = inject(MatDialog)
  private readonly _createUser = inject(CreateUser)
  private readonly _UserState = inject(UserState)

  readonly creating = signal(false)

  handleClick() {
    const dialogRef = this._dialog.open(CreateUserDialog, {
      width: '520px',
    })

    dialogRef.afterClosed().subscribe(async (result?: UserCreatePayload) => {
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
