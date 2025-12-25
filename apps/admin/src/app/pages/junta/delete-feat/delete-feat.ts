import { Component, effect, inject } from '@angular/core'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaState } from '../junta-page-state'

import { DeleteJuntaDialog } from './components/delete-junta-dialog'
import { JuntaDelete } from './services/junta-delete'

@Component({
  selector: 'ja-junta-delete-feat',
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _juntaDelete = inject(JuntaDelete)
  private readonly _snackbar = inject(Snackbar)
  private readonly _state = inject(JuntaState)

  constructor() {
    effect(this._listenForJuntaDelete)
  }

  private _listenForJuntaDelete = () => {
    const junta = this._state.deleteJunta()

    if (junta) {
      this._openDeleteDialog(junta)
      this._state.emitDeleteJunta(null)
    }
  }

  private async _openDeleteDialog(junta: Junta): Promise<void> {
    this._dialog.open(DeleteJuntaDialog, {
      junta,
      handleDelete: this._handleDelete,
    })
  }

  private _handleDelete = async (junta: Junta): Promise<void> => {
    try {
      await this._juntaDelete.delete(junta.id)

      this._state.emitJuntaDeleted(junta)
      this._snackbar.success('Junta deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete junta')
    }
  }
}

