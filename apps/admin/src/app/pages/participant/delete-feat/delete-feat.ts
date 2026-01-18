import { Component, effect, inject } from '@angular/core'

import { CrudDeleteDialog } from '@/admin/shared/components/crud'
import { Participant } from '@/admin/shared/interfaces/participant'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantState } from '../participant-page-state'

import { ParticipantDelete } from './services/participant-delete'

@Component({
  selector: 'ja-participant-delete-feat',
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _participantDelete = inject(ParticipantDelete)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(ParticipantState)

  private _currentParticipant: Participant | null = null

  constructor() {
    effect(this._listenForParticipantDelete)
  }

  private _listenForParticipantDelete = () => {
    const participant = this._state.deleteParticipant()

    if (participant) {
      this._openDeleteDialog(participant)
      this._state.emitDeleteParticipant(null)
    }
  }

  private _openDeleteDialog(participant: Participant): void {
    this._currentParticipant = participant

    this._dialog.open(CrudDeleteDialog, {
      entityName: 'Participant',
      displayName: `${participant.name} ${participant.surname}`,
      handleDelete: this._handleDelete,
    })
  }

  private _handleDelete = async (): Promise<void> => {
    if (!this._currentParticipant) return

    try {
      await this._participantDelete.delete(this._currentParticipant.id)

      this._state.emitParticipantDeleted(this._currentParticipant)
      this._snackbar.success('Participant deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete participant')
    }
  }
}
