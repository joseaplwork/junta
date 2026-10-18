import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { CreateParticipantRequest } from '@junta/contracts'

import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import {
  ParticipantFormDialog,
  ParticipantFormDialogData,
} from '../components/participant-form-dialog/participant-form-dialog'
import { ParticipantPageState } from '../participant-page-state'

@Component({
  selector: 'ja-participant-create-feat',
  templateUrl: './create-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _participantsApi = inject(ParticipantsApi)
  private readonly _state = inject(ParticipantPageState)
  private readonly _snackbar = inject(Snackbar)

  openDialog(): void {
    this._dialog.open<ParticipantFormDialog, ParticipantFormDialogData>(
      ParticipantFormDialog,
      {
        title: 'Create Participant',
        submitLabel: 'Create',
        participant: null,
        handleSubmit: request => this._create(request),
      },
    )
  }

  private async _create(request: CreateParticipantRequest): Promise<boolean> {
    try {
      this._state.emitCreated(await this._participantsApi.create(request))
      this._snackbar.success('Participant created')

      return true
    } catch {
      this._snackbar.error('Failed to create participant')

      return false
    }
  }
}
