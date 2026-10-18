import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'

import { JuntaResponse } from '@junta/contracts'

import { JuntasApi } from '@/admin/shared/api/juntas-api'
import {
  CrudDeleteDialog,
  DeleteDialogData,
} from '@/admin/shared/components/crud'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaPageState } from '../junta-page-state'

@Component({
  selector: 'ja-junta-delete-feat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _juntasApi = inject(JuntasApi)
  private readonly _state = inject(JuntaPageState)
  private readonly _snackbar = inject(Snackbar)

  constructor() {
    effect(() => {
      const junta = this._state.deleteRequest()

      if (!junta) return

      this._state.requestDelete(null)
      this._openDialog(junta)
    })
  }

  private _openDialog(junta: JuntaResponse): void {
    this._dialog.open<CrudDeleteDialog, DeleteDialogData>(CrudDeleteDialog, {
      entityName: 'Junta',
      displayName: junta.name,
      handleDelete: () => this._delete(junta),
    })
  }

  private async _delete(junta: JuntaResponse): Promise<boolean> {
    try {
      await this._juntasApi.remove(junta.id)
      this._state.emitDeleted(junta)
      this._snackbar.success('Junta deleted')

      return true
    } catch {
      this._snackbar.error('Failed to delete junta')

      return false
    }
  }
}
