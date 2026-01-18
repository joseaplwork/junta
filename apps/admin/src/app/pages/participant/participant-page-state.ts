import { signal } from '@angular/core'

import { Participant } from '@/admin/shared/interfaces/participant'

export class ParticipantState {
  private readonly _deleteParticipant = signal<Participant | null>(null)
  private readonly _participantDeleted = signal<Participant | null>(null)
  private readonly _participantCreated = signal<Participant | null>(null)
  private readonly _updateParticipant = signal<Participant | null>(null)
  private readonly _participantUpdated = signal<Participant | null>(null)

  readonly deleteParticipant = this._deleteParticipant.asReadonly()
  readonly participantDeleted = this._participantDeleted.asReadonly()
  readonly participantCreated = this._participantCreated.asReadonly()
  readonly updateParticipant = this._updateParticipant.asReadonly()
  readonly participantUpdated = this._participantUpdated.asReadonly()

  emitDeleteParticipant(participant: Participant | null): void {
    this._deleteParticipant.set(participant)
  }

  emitParticipantDeleted(participant: Participant): void {
    this._participantDeleted.set(participant)
  }

  emitParticipantCreated(participant: Participant): void {
    this._participantCreated.set(participant)
  }

  emitUpdateParticipant(participant: Participant | null): void {
    this._updateParticipant.set(participant)
  }

  emitParticipantUpdated(participant: Participant): void {
    this._participantUpdated.set(participant)
  }
}
