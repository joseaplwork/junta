import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { CreateAdminRequest } from '@junta/contracts'

import { AdminsApi } from '@/admin/shared/api/admins-api'
import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import {
  CreateAdminDialog,
  CreateAdminDialogData,
} from './components/create-admin-dialog'

@Component({
  selector: 'ja-admin-create-feat',
  templateUrl: './create-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _adminsApi = inject(AdminsApi)
  private readonly _state = inject(AdminPageState)
  private readonly _snackbar = inject(Snackbar)

  openDialog(): void {
    this._dialog.open<CreateAdminDialog, CreateAdminDialogData>(
      CreateAdminDialog,
      { handleSubmit: request => this._create(request) },
    )
  }

  private async _create(request: CreateAdminRequest): Promise<boolean> {
    try {
      this._state.emitCreated(await this._adminsApi.create(request))
      this._snackbar.success('Admin created')

      return true
    } catch {
      this._snackbar.error('Failed to create admin')

      return false
    }
  }
}
