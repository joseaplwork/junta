import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTableModule } from '@angular/material/table'

import { User } from '@/admin/shared/interfaces/user'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UserState } from '../user-page-state'

import { UserListTable } from './components/user-list-table'
import { UserData } from './services/user-data'

@Component({
  selector: 'ja-user-list-feat',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    UserListTable,
  ],
  templateUrl: './list-feat.html',
})
export class ListFeat {
  private readonly _state = inject(UserState)
  private readonly _userData = inject(UserData)
  private readonly _snackbar = inject(Snackbar)

  displayedColumns = ['name', 'surname', 'phoneNumber', 'actions']
  users = signal<User[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this.loadUsers()

    effect(this._listenForNewUser)
    effect(this._listenForDeletedUser)
    effect(this._listenForUpdatedUser)
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const users = await this._userData.fetchAll()

      this.users.set(users)
    } catch {
      this.error.set('Failed to load users')
      this._snackbar.error('Failed to load users')
    } finally {
      this.loading.set(false)
    }
  }

  editUser(user: User): void {
    this._state.emitUpdateUser(user)
  }

  deleteUser(user: User): void {
    this._state.emitDeleteUser(user)
  }

  private _listenForNewUser = () => {
    const user = this._state.userCreated()

    if (user) {
      this.users.update(current => [...current, user])
    }
  }

  private _listenForDeletedUser = () => {
    const user = this._state.userDeleted()

    if (user) {
      this.users.update(current => current.filter(u => u.id !== user.id))
    }
  }

  private _listenForUpdatedUser = () => {
    const updatedUser = this._state.userUpdated()

    if (updatedUser) {
      this.users.update(current =>
        current.map(u => (u.id === updatedUser.id ? updatedUser : u)),
      )
    }
  }
}
