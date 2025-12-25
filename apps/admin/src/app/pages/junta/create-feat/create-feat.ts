import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { JuntaState } from '../junta-page-state'

import { CreateJuntaDialog } from './components/create-junta-dialog'
import { CreatePayload } from './interfaces/create-payload'
import { JuntaCreate } from './services/junta-create'

@Component({
  selector: 'ja-junta-create-feat',
  templateUrl: './create-feat.html',
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _juntaCreate = inject(JuntaCreate)
  private readonly _state = inject(JuntaState)
  private readonly _snackbar = inject(Snackbar)

  handleClick(): void {
    this._dialog.open(CreateJuntaDialog, { handleSubmit: this._handleSubmit })
  }

  private _handleSubmit = async (payload: CreatePayload): Promise<void> => {
    try {
      const junta = await this._juntaCreate.create(payload)

      this._state.emitJuntaCreated(junta)
      this._snackbar.success('Junta created successfully')
    } catch {
      this._snackbar.error('Failed to create junta')
    }
  }
}

