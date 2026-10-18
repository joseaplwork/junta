import { Injectable, signal } from '@angular/core'

import { ParticipantResponse } from '@junta/contracts'

/**
 * Lets the page features talk without importing each other.
 * Requests (`updateRequest`, `deleteRequest`) are cleared by the feature that handles them.
 */
@Injectable()
export class ParticipantPageState {
  private readonly _updateRequest = signal<ParticipantResponse | null>(null)
  private readonly _deleteRequest = signal<ParticipantResponse | null>(null)
  private readonly _created = signal<ParticipantResponse | null>(null)
  private readonly _updated = signal<ParticipantResponse | null>(null)
  private readonly _deleted = signal<ParticipantResponse | null>(null)

  readonly updateRequest = this._updateRequest.asReadonly()
  readonly deleteRequest = this._deleteRequest.asReadonly()
  readonly created = this._created.asReadonly()
  readonly updated = this._updated.asReadonly()
  readonly deleted = this._deleted.asReadonly()

  requestUpdate(participant: ParticipantResponse | null): void {
    this._updateRequest.set(participant)
  }

  requestDelete(participant: ParticipantResponse | null): void {
    this._deleteRequest.set(participant)
  }

  emitCreated(participant: ParticipantResponse): void {
    this._created.set(participant)
  }

  emitUpdated(participant: ParticipantResponse): void {
    this._updated.set(participant)
  }

  emitDeleted(participant: ParticipantResponse): void {
    this._deleted.set(participant)
  }
}
