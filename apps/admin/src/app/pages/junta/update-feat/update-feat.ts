import { Component, effect, inject } from '@angular/core'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaState } from '../junta-page-state'

import { UpdateJuntaDialog } from './components/update-junta-dialog'
import { UpdatePayload } from './interfaces/update-payload'
import { JuntaUpdate } from './services/junta-update'

@Component({
  selector: 'ja-junta-update-feat',
  template: '',
})
export class UpdateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _juntaUpdate = inject(JuntaUpdate)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(JuntaState)

  constructor() {
    effect(this._listenForJuntaUpdate)
  }

  private _listenForJuntaUpdate = () => {
    const junta = this._state.updateJunta()

    if (junta) {
      this._openUpdateDialog(junta)
      this._state.emitUpdateJunta(null)
    }
  }

  private async _openUpdateDialog(junta: Junta): Promise<void> {
    this._dialog.open(UpdateJuntaDialog, {
      junta,
      handleUpdate: this._handleUpdate,
    })
  }

  private _handleUpdate = async (
    id: string,
    payload: UpdatePayload,
  ): Promise<void> => {
    try {
      const updatedJunta = await this._juntaUpdate.update(id, payload)

      this._state.emitJuntaUpdated(updatedJunta)
      this._snackbar.success('Junta updated successfully')
    } catch {
      this._snackbar.error('Failed to update junta')
    }
  }
}

