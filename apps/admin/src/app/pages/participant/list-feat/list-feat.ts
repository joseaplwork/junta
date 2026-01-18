import { Component, effect, inject, signal } from '@angular/core'

import {
  ActionConfig,
  ColumnConfig,
  CrudDataTable,
} from '@/admin/shared/components/crud'
import { Participant } from '@/admin/shared/interfaces/participant'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantState } from '../participant-page-state'

import { ParticipantData } from './services/participant-data'

@Component({
  selector: 'ja-participant-list-feat',
  imports: [CrudDataTable],
  templateUrl: './list-feat.html',
})
export class ListFeat {
  private readonly _state = inject(ParticipantState)
  private readonly _participantData = inject(ParticipantData)
  private readonly _snackbar = inject(Snackbar)
  private readonly _navigation = inject(Navigation)

  columns: ColumnConfig[] = [
    { key: 'name', header: 'Name', type: 'combined', combineWith: 'surname' },
    { key: 'phoneNumber', header: 'Phone', type: 'text' },
  ]

  actions: ActionConfig = { view: true, edit: true, delete: true }

  participants = signal<Participant[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this._loadParticipants()

    effect(this._listenForNewParticipant)
    effect(this._listenForDeletedParticipant)
    effect(this._listenForUpdatedParticipant)
  }

  viewParticipant(participant: Participant): void {
    this._navigation.goToParticipantDetails(participant.id)
  }

  editParticipant(participant: Participant): void {
    this._state.emitUpdateParticipant(participant)
  }

  deleteParticipant(participant: Participant): void {
    this._state.emitDeleteParticipant(participant)
  }

  private async _loadParticipants(): Promise<void> {
    this.loading.set(true)
    this.error.set(null)

    try {
      const participants = await this._participantData.fetchAll()

      this.participants.set(participants)
    } catch {
      this.error.set('Failed to load participants')
      this._snackbar.error('Failed to load participants')
    } finally {
      this.loading.set(false)
    }
  }

  private _listenForNewParticipant = () => {
    const participant = this._state.participantCreated()

    if (participant) {
      this.participants.update(current => [...current, participant])
    }
  }

  private _listenForDeletedParticipant = () => {
    const participant = this._state.participantDeleted()

    if (participant) {
      this.participants.update(current => current.filter(p => p.id !== participant.id))
    }
  }

  private _listenForUpdatedParticipant = () => {
    const updatedParticipant = this._state.participantUpdated()

    if (updatedParticipant) {
      this.participants.update(current =>
        current.map(p => (p.id === updatedParticipant.id ? updatedParticipant : p)),
      )
    }
  }
}
