import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'

import { User } from '@/admin/shared/interfaces/user'

import { DeleteFeature } from '../delete-ft/delete-ft'
import { UpdateFeature } from '../update-ft/update-ft'
import { UserState } from '../user-page-state'

import { UserListTable } from './components/user-list-table'
import { UserData } from './services/user-data'

@Component({
  selector: 'app-users-list-ft',
  templateUrl: './list-ft.html',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    UserListTable,
  ],
})
export class ListFeature {
  private readonly _data = inject(UserData)
  private readonly _dialog = inject(MatDialog)
  private readonly _snack = inject(MatSnackBar)
  private readonly _UserState = inject(UserState)

  readonly users = signal<User[]>([])
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)

  constructor() {
    this.loadUsers()

    effect(() => {
      const newUser = this._UserState.newUser()

      if (newUser) {
        this.users.update(arr => [...arr, newUser])
        this._snack.open('User created', 'Close', { duration: 2500 })
        this._UserState.clearNewUser()
      }
    })
  }

  async loadUsers() {
    this.loading.set(true)
    this.error.set(null)

    try {
      const list = await this._data.fetchAll()

      this.users.set(list)
    } catch {
      this.error.set('Failed to load users')
    } finally {
      this.loading.set(false)
    }
  }

  async onEditUser(user: User) {
    const dialogRef = this._dialog.open(UpdateFeature, {
      width: '420px',
      data: user,
    })

    dialogRef.afterClosed().subscribe(async (updated?: User) => {
      if (!updated) return

      try {
        const result = await this._data.update(user.id, {
          name: updated.name,
          surname: updated.surname,
          phone: updated.phoneNumber,
        })

        this.users.update(arr =>
          arr.map(u => (u.id === user.id ? { ...u, ...result } : u)),
        )
        this._snack.open('User updated', 'Close', { duration: 2500 })
      } catch {
        this._snack.open('Update failed', 'Close', { duration: 3000 })
      }
    })
  }

  async onDeleteUser(user: User) {
    const dialogRef = this._dialog.open(DeleteFeature, {
      width: '400px',
      data: { name: `${user.name} ${user.surname}` },
    })

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (!confirmed) return

      try {
        await this._data.delete(user.id)

        this.users.update(arr => arr.filter(u => u.id !== user.id))
        this._snack.open('User deleted', 'Close', { duration: 2500 })
      } catch {
        this._snack.open('Delete failed', 'Close', { duration: 3000 })
      }
    })
  }
}
