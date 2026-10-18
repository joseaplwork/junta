import { Injectable, signal } from '@angular/core'

import { AccountResponse } from '@junta/contracts'

/**
 * Lets the page features talk without importing each other.
 * Requests (`updateRequest`, `deleteRequest`) are cleared by the feature that handles them.
 */
@Injectable()
export class AccountPageState {
  private readonly _updateRequest = signal<AccountResponse | null>(null)
  private readonly _deleteRequest = signal<AccountResponse | null>(null)
  private readonly _created = signal<AccountResponse | null>(null)
  private readonly _updated = signal<AccountResponse | null>(null)
  private readonly _deleted = signal<AccountResponse | null>(null)

  readonly updateRequest = this._updateRequest.asReadonly()
  readonly deleteRequest = this._deleteRequest.asReadonly()
  readonly created = this._created.asReadonly()
  readonly updated = this._updated.asReadonly()
  readonly deleted = this._deleted.asReadonly()

  requestUpdate(account: AccountResponse | null): void {
    this._updateRequest.set(account)
  }

  requestDelete(account: AccountResponse | null): void {
    this._deleteRequest.set(account)
  }

  emitCreated(account: AccountResponse): void {
    this._created.set(account)
  }

  emitUpdated(account: AccountResponse): void {
    this._updated.set(account)
  }

  emitDeleted(account: AccountResponse): void {
    this._deleted.set(account)
  }
}
