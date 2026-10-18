import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { ParticipantResponse } from '@junta/contracts'

import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import {
  CrudDeleteDialog,
  DeleteDialogData,
} from '@/admin/shared/components/crud'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantPageState } from '../participant-page-state'

@Component({
  selector: 'ja-participant-delete-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _participantsApi = inject(ParticipantsApi)
  private readonly _state = inject(ParticipantPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const participant = this._state.deleteRequest()

      if (!participant) return

      this._state.requestDelete(null)
      this._openDialog(participant)
    })
  }

  private _openDialog(participant: ParticipantResponse): void {
    this._dialog.open<CrudDeleteDialog, DeleteDialogData>(CrudDeleteDialog, {
      entityName: 'Participant',
      displayName: `${participant.name} ${participant.surname}`,
      handleDelete: () => this._delete(participant),
    })
  }

  private async _delete(participant: ParticipantResponse): Promise<boolean> {
    try {
      await this._participantsApi.remove(participant.id)
      this._state.emitDeleted(participant)
      this._snackbar.success('Participant deleted')

      return true
    } catch {
      this._snackbar.error('Failed to delete participant')

      return false
    }
  }
}
