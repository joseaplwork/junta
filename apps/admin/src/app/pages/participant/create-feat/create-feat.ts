import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantState } from '../participant-page-state'

import { CreateParticipantDialog } from './components/create-participant-dialog'
import { CreatePayload } from './interfaces/create-payload'
import { CreateParticipant } from './services/create-participant'

@Component({
  selector: 'ja-participant-create-feat',
  templateUrl: './create-feat.html',
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _createParticipant = inject(CreateParticipant)
  private readonly _state = inject(ParticipantState)
  private readonly _snackbar = inject(Snackbar)

  handleClick(): void {
    this._dialog.open(CreateParticipantDialog, {
      handleSubmit: this._handleSubmit,
    })
  }

  private _handleSubmit = async (payload: CreatePayload): Promise<void> => {
    try {
      const participant = await this._createParticipant.create(payload)

      this._state.emitParticipantCreated(participant)
      this._snackbar.success('Participant created successfully')
    } catch {
      this._snackbar.error('Failed to create participant')
    }
  }
}
