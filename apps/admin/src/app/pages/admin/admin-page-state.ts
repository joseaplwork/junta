import { signal } from '@angular/core'

import { Admin } from '@/admin/shared/interfaces/admin'

export class AdminPageState {
  private readonly _newAdmin = signal<Admin | null>(null)

  readonly newAdmin = this._newAdmin.asReadonly()

  addNewAdmin(admin: Admin) {
    this._newAdmin.set(admin)
  }

  clearNewAdmin() {
    this._newAdmin.set(null)
  }
}
