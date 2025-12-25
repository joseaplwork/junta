import { Component, effect, inject, signal } from '@angular/core'

import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Admin } from '@/admin/shared/interfaces/admin'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import { AdminData } from './services/admin-data'

@Component({
  selector: 'ja-admin-list-feat',
  imports: [CrudDataTable],
  templateUrl: './list-feat.html',
})
export class ListFeat {
  private readonly _state = inject(AdminPageState)
  private readonly _adminData = inject(AdminData)
  private readonly _snackbar = inject(Snackbar)

  columns: ColumnConfig[] = [
    { key: 'email', header: 'Email', type: 'text' },
    { key: 'roles', header: 'Roles', type: 'tags' },
    {
      key: 'name',
      header: 'Name',
      type: 'text',
      getValue: (row: unknown) => {
        const admin = row as Admin

        return `${admin.user.name} ${admin.user.surname}`
      },
    },
  ]

  actions: ActionConfig = { edit: true, delete: true }

  admins = signal<Admin[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this._loadAdmins()

    effect(this._listenForNewAdmin)
    effect(this._listenForDeletedAdmin)
    effect(this._listenForUpdatedAdmin)
  }

  editAdmin(admin: Admin): void {
    this._state.emitUpdateAdmin(admin)
  }

  deleteAdmin(admin: Admin): void {
    this._state.emitDeleteAdmin(admin)
  }

  private async _loadAdmins(): Promise<void> {
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
