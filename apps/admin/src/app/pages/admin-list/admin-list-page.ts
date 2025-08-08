import { Component, OnInit, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'

import { Admin } from '../../shared/interfaces/admin'

import { DeleteAdminDialog } from './components/delete-admin-dialog'
import { EditAdminDialog } from './components/edit-admin-dialog'
import { AdminListDataService } from './services/admin-data'

@Component({
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule,
    EditAdminDialog,
    DeleteAdminDialog,
  ],
  templateUrl: './admin-list-page.html',
})
export class AdminListPage implements OnInit {
  private readonly _adminListData = inject(AdminListDataService)
  private readonly _dialog = inject(MatDialog)
  private readonly _snackBar = inject(MatSnackBar)

  displayedColumns: string[] = ['name', 'email', 'role', 'phone', 'actions']
  admins = signal<Admin[]>([])
  loading = signal<boolean>(false)
  error = signal<string | null>(null)

  async ngOnInit() {
    await this.loadAdmins()
  }

  async loadAdmins() {
    this.loading.set(true)

    try {
      const admins = await this._adminListData.fetchAll()

      this.admins.set(admins)
      this.error.set(null)
    } catch (err) {
      this.error.set('Failed to load admins')
      console.error(err)
    } finally {
      this.loading.set(false)
    }
  }

  openEditDialog(admin: Admin) {
    const dialogRef = this._dialog.open(EditAdminDialog, {
      width: '500px',
      data: admin,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._adminListData
          .update(admin.id, result)
          .then(() => this.loadAdmins())
          .then(() => {
            this._snackBar.open('Admin updated successfully', 'Close', {
              duration: 3000,
            })
          })
          .catch(error => {
            console.error(error)
            this._snackBar.open('Failed to update admin', 'Close', {
              duration: 3000,
            })
          })
      }
    })
  }

  confirmDelete(admin: Admin) {
    const dialogRef = this._dialog.open(DeleteAdminDialog, {
      width: '400px',
      data: admin,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._adminListData
          .delete(admin.id)
          .then(() => this.loadAdmins())
          .then(() => {
            this._snackBar.open('Admin deleted successfully', 'Close', {
              duration: 3000,
            })
          })
          .catch(error => {
            console.error(error)
            this._snackBar.open('Failed to delete admin', 'Close', {
              duration: 3000,
            })
          })
      }
    })
  }
}
