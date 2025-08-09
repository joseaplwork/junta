import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'

import { Admin } from '@/admin/shared/interfaces/admin'

import { AdminPageState } from '../admin-page-state'
import { DeleteAdminDialog } from '../delete-feature/components/delete-admin-dialog'
import { UpdateAdminDialog } from '../update-feature/components/update-admin-dialog'

import { AdminDataService } from './services/admin-data'

@Component({
  selector: 'app-admin-list-feature',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './list-feature.html',
})
export class ListFeature {
  private readonly _AdminPageState = inject(AdminPageState)
  private readonly _adminDataService = inject(AdminDataService)
  private readonly _snackBar = inject(MatSnackBar)
  private readonly _dialog = inject(MatDialog)

  displayedColumns = ['email', 'roles', 'name', 'actions']

  admins = signal<Admin[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    effect(() => {
      const newAdmin = this._AdminPageState.newAdmin()

      if (newAdmin) {
        this.admins.update(current => [...current, newAdmin])
        this._AdminPageState.clearNewAdmin()
      }
    })

    this.loadAdmins()
  }

  async loadAdmins(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const admins = await this._adminDataService.fetchAll()

      this.admins.set(admins)
    } catch {
      this.error.set('Failed to load admins')
      this._snackBar.open('Failed to load admins', 'Close', {
        duration: 3000,
      })
    } finally {
      this.loading.set(false)
    }
  }

  async editAdmin(admin: Admin): Promise<void> {
    const dialogRef = this._dialog.open(UpdateAdminDialog, {
      width: '400px',
      data: admin,
    })

    dialogRef.afterClosed().subscribe(updatedAdmin => {
      if (updatedAdmin) {
        this.admins.update(current =>
          current.map(a => (a.id === admin.id ? updatedAdmin : a)),
        )
      }
    })
  }

  async deleteAdmin(admin: Admin): Promise<void> {
    const dialogRef = this._dialog.open(DeleteAdminDialog, {
      width: '400px',
      data: admin,
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this._adminDataService.delete(admin.id)
          this.admins.update(current => current.filter(a => a.id !== admin.id))
          this._snackBar.open('Admin deleted successfully', 'Close', {
            duration: 3000,
          })
        } catch {
          this._snackBar.open('Failed to delete admin', 'Close', {
            duration: 3000,
          })
        }
      }
    })
  }
}
