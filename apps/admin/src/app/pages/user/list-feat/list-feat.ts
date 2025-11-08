import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'

import { User } from '@/admin/shared/interfaces/user'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { DeleteFeat } from '../delete-feat/delete-feat'
import { UpdateFeat } from '../update-feat/update-feat'
import { UserState } from '../user-page-state'

import { UserListTable } from './components/user-list-table'
import { UserData } from './services/user-data'

@Component({
  selector: 'ja-user-list-feat',
  templateUrl: './list-feat.html',
  imports: [MatTableModule, MatButtonModule, MatIconModule, UserListTable],
})
export class ListFeat {
  private readonly _data = inject(UserData)
  private readonly _dialog = inject(Dialog)
  private readonly _snackbar = inject(Snackbar)
  private readonly _userState = inject(UserState)

  readonly users = signal<User[]>([])
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)

  constructor() {
    this.loadUsers()

    effect(() => {
      const newUser = this._userState.newUser()

      if (newUser) {
        this.users.update(arr => [...arr, newUser])
        this._snackbar.success('User created')
        this._userState.clearNewUser()
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
    const updateFeatDialog = this._dialog.open<User>(UpdateFeat, user)

    updateFeatDialog.afterClosed().subscribe(async (updated?: User) => {
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
        this._snackbar.success('User updated')
      } catch {
        this._snackbar.error('Update failed')
      }
    })
  }

  async onDeleteUser(user: User) {
    const deleteFeatDialog = this._dialog.open<boolean>(DeleteFeat, {
      name: `${user.name} ${user.surname}`,
    })

    deleteFeatDialog.afterClosed().subscribe(async (confirmed?: boolean) => {
      if (!confirmed) return

      try {
        await this._data.delete(user.id)

        this.users.update(arr => arr.filter(u => u.id !== user.id))
        this._snackbar.success('User deleted')
      } catch {
        this._snackbar.error('Delete failed')
      }
    })
  }
}
