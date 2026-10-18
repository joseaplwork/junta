import { Injectable, signal } from '@angular/core'

import { JuntaResponse } from '@junta/contracts'

/**
 * Lets the page features talk without importing each other.
 * Create and edit live on their own pages, so only deletion goes through state.
 */
@Injectable()
export class JuntaPageState {
  private readonly _deleteRequest = signal<JuntaResponse | null>(null)
  private readonly _deleted = signal<JuntaResponse | null>(null)

  readonly deleteRequest = this._deleteRequest.asReadonly()
  readonly deleted = this._deleted.asReadonly()

  requestDelete(junta: JuntaResponse | null): void {
    this._deleteRequest.set(junta)
  }

  emitDeleted(junta: JuntaResponse): void {
    this._deleted.set(junta)
  }
}
