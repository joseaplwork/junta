import { Injectable, signal } from '@angular/core'

import { AdminResponse } from '@junta/contracts'

/**
 * Lets the page features talk without importing each other.
 * Requests (`updateRequest`, `deleteRequest`) are cleared by the feature that handles them.
 */
@Injectable()
export class AdminPageState {
  private readonly _updateRequest = signal<AdminResponse | null>(null)
  private readonly _deleteRequest = signal<AdminResponse | null>(null)
  private readonly _created = signal<AdminResponse | null>(null)
  private readonly _updated = signal<AdminResponse | null>(null)
  private readonly _deleted = signal<AdminResponse | null>(null)

  readonly updateRequest = this._updateRequest.asReadonly()
  readonly deleteRequest = this._deleteRequest.asReadonly()
  readonly created = this._created.asReadonly()
  readonly updated = this._updated.asReadonly()
  readonly deleted = this._deleted.asReadonly()

  requestUpdate(admin: AdminResponse | null): void {
    this._updateRequest.set(admin)
  }

  requestDelete(admin: AdminResponse | null): void {
    this._deleteRequest.set(admin)
  }

  emitCreated(admin: AdminResponse): void {
    this._created.set(admin)
  }

  emitUpdated(admin: AdminResponse): void {
    this._updated.set(admin)
  }

  emitDeleted(admin: AdminResponse): void {
    this._deleted.set(admin)
  }
}
