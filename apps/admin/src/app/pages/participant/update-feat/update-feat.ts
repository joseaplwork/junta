import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { ParticipantResponse, UpdateParticipantRequest } from '@junta/contracts'

import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import {
  ParticipantFormDialog,
  ParticipantFormDialogData,
} from '../components/participant-form-dialog/participant-form-dialog'
import { ParticipantPageState } from '../participant-page-state'

@Component({
  selector: 'ja-participant-update-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _participantsApi = inject(ParticipantsApi)
  private readonly _state = inject(ParticipantPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const participant = this._state.updateRequest()

      if (!participant) return

      this._state.requestUpdate(null)
      this._openDialog(participant)
    })
  }

  private _openDialog(participant: ParticipantResponse): void {
    this._dialog.open<ParticipantFormDialog, ParticipantFormDialogData>(
      ParticipantFormDialog,
      {
        title: 'Update Participant',
        submitLabel: 'Save',
        participant,
        handleSubmit: request => this._update(participant.id, request),
      },
    )
  }

  private async _update(
    id: string,
    request: UpdateParticipantRequest,
  ): Promise<boolean> {
    try {
      this._state.emitUpdated(await this._participantsApi.update(id, request))
      this._snackbar.success('Participant updated')

      return true
    } catch {
      this._snackbar.error('Failed to update participant')

      return false
    }
  }
}
