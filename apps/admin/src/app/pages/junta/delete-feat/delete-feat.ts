import { Component, effect, inject } from '@angular/core'

import { CrudDeleteDialog } from '@/admin/shared/components/crud'
import { Junta } from '@/admin/shared/interfaces/junta'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaState } from '../junta-page-state'

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

  private _currentJunta: Junta | null = null

  constructor() {
    effect(this._listenForJuntaDelete)
  }

  private _listenForJuntaDelete = () => {
    const junta = this._state.deleteJunta()

    if (junta) {
      this._openDeleteDialog(junta)
    }
  }

  private _openDeleteDialog(junta: Junta): void {
    this._currentJunta = junta

    this._dialog.open(CrudDeleteDialog, {
      entityName: 'Junta',
      displayName: junta.name,
      handleDelete: this._handleDelete,
    })
  }

  private _handleDelete = async (): Promise<void> => {
    if (!this._currentJunta) return

    try {
      await this._juntaDelete.delete(this._currentJunta.id)

      this._state.emitJuntaDeleted(this._currentJunta)
      this._snackbar.success('Junta deleted successfully')
    } catch {
      this._snackbar.error('Failed to delete junta')
      throw new Error('Delete failed')
    } finally {
      this._state.emitDeleteJunta(null)
    }
  }
}
