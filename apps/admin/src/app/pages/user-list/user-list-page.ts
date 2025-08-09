import { Component, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'

import { User } from '@/admin/shared/interfaces/user'

import { DeleteUserDialog } from './components/delete-user-dialog'
import {
  EditUserDialog,
  EditUserDialogData,
} from './components/edit-user-dialog'
import { UserListDataService } from './services/user-data'

@Component({
  templateUrl: './user-list-page.html',
  imports: [
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class UserListPage {
  private readonly _data = inject(UserListDataService)
  private readonly _dialog = inject(MatDialog)
  private readonly _snack = inject(MatSnackBar)

  users = signal<User[]>([])
  loading = signal(true)
  error = signal<string | null>(null)
  displayedColumns = ['name', 'phone', 'actions']

  constructor() {
    this.load()
  }

  async load() {
    this.loading.set(true)
    try {
      const list = await this._data.fetchAll()

      this.users.set(list)
      this.error.set(null)
    } catch {
      this.error.set('Failed to load users')
    } finally {
      this.loading.set(false)
    }
  }

  openEditDialog(user: User) {
    const dialogRef = this._dialog.open(EditUserDialog, {
      width: '420px',
      data: {
        name: user.name,
        surname: user.surname,
        phone: user.phoneNumber,
      } as EditUserDialogData,
    })

    dialogRef.afterClosed().subscribe(async (result?: EditUserDialogData) => {
      if (!result) return
      try {
        const updated = await this._data.update(user.id, result)

        this.users.update(arr =>
          arr.map(u => (u.id === user.id ? { ...u, ...updated } : u)),
        )
        this._snack.open('User updated', 'Close', { duration: 2500 })
      } catch {
        this._snack.open('Update failed', 'Close', { duration: 3000 })
      }
    })
  }

  confirmDelete(user: User) {
    const dialogRef = this._dialog.open(DeleteUserDialog, {
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
