import { Component, effect, inject } from '@angular/core'

import { Participant } from '@/admin/shared/interfaces/participant'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantState } from '../participant-page-state'

import { UpdateParticipantDialog } from './components/update-participant-dialog'
import { UpdatePayload } from './interfaces/update-payload'
import { ParticipantUpdate } from './services/participant-update'

@Component({
  selector: 'ja-participant-update-feat',
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _participantUpdate = inject(ParticipantUpdate)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(ParticipantState)

  constructor() {
    effect(this._listenForParticipantUpdate)
  }

  private _listenForParticipantUpdate = () => {
    const participant = this._state.updateParticipant()

    if (participant) {
      this.openUpdateDialog(participant)
      this._state.emitUpdateParticipant(null)
    }
  }

  private async openUpdateDialog(participant: Participant): Promise<void> {
    this._dialog.open(UpdateParticipantDialog, {
      participant,
      handleUpdate: this._handleUpdate,
    })
  }

  private _handleUpdate = async (
    id: string,
    payload: UpdatePayload,
  ): Promise<void> => {
    try {
      const updatedParticipant = await this._participantUpdate.update(
        id,
        payload,
      )

      this._state.emitParticipantUpdated(updatedParticipant)
      this._snackbar.success('Participant updated successfully')
    } catch {
      this._snackbar.error('Failed to update participant')
    }
  }
}
