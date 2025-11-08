import { signal } from '@angular/core'

import { Admin } from '@/admin/shared/interfaces/admin'

export class AdminPageState {
  private readonly _deleteAdmin = signal<Admin | null>(null)
  private readonly _adminDeleted = signal<Admin | null>(null)
  private readonly _adminCreated = signal<Admin | null>(null)
  private readonly _updateAdmin = signal<Admin | null>(null)
  private readonly _adminUpdated = signal<Admin | null>(null)

  readonly deleteAdmin = this._deleteAdmin.asReadonly()
  readonly adminDeleted = this._adminDeleted.asReadonly()
  readonly adminCreated = this._adminCreated.asReadonly()
  readonly updateAdmin = this._updateAdmin.asReadonly()
  readonly adminUpdated = this._adminUpdated.asReadonly()

  emitDeleteAdmin(admin: Admin | null): void {
    this._deleteAdmin.set(admin)
  }

  emitAdminDeleted(admin: Admin): void {
    this._adminDeleted.set(admin)
  }

  emitAdminCreated(admin: Admin): void {
    this._adminCreated.set(admin)
  }

  emitUpdateAdmin(admin: Admin | null): void {
    this._updateAdmin.set(admin)
  }

  emitAdminUpdated(admin: Admin): void {
    this._adminUpdated.set(admin)
  }
}
