import { Component, effect, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTableModule } from '@angular/material/table'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import { AdminData } from './services/admin-data'

@Component({
  selector: 'ja-admin-list-feat',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './list-feat.html',
})
export class ListFeat {
  private readonly _state = inject(AdminPageState)
  private readonly _adminData = inject(AdminData)
  private readonly _snackbar = inject(Snackbar)

  displayedColumns = ['email', 'roles', 'name', 'actions']
  admins = signal<Admin[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this.loadAdmins()

    effect(this._listenForNewAdmin)
    effect(this._listenForDeletedAdmin)
    effect(this._listenForUpdatedAdmin)
  }

  async loadAdmins(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const admins = await this._adminData.fetchAll()

      this.admins.set(admins)
    } catch {
      this.error.set('Failed to load admins')
      this._snackbar.error('Failed to load admins')
    } finally {
      this.loading.set(false)
    }
  }

  editAdmin(admin: Admin): void {
    this._state.emitUpdateAdmin(admin)
  }

  deleteAdmin(admin: Admin): void {
    this._state.emitDeleteAdmin(admin)
  }

  private _listenForNewAdmin = () => {
    const admin = this._state.adminCreated()

    if (admin) {
      this.admins.update(current => [...current, admin])
    }
  }

  private _listenForDeletedAdmin = () => {
    const admin = this._state.adminDeleted()

    if (admin) {
      this.admins.update(current => current.filter(a => a.id !== admin.id))
    }
  }

  private _listenForUpdatedAdmin = () => {
    const updatedAdmin = this._state.adminUpdated()

    if (updatedAdmin) {
      this.admins.update(current =>
        current.map(a => (a.id === updatedAdmin.id ? updatedAdmin : a)),
      )
    }
  }
}
