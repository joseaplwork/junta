import { Component, inject } from '@angular/core'
import { MatFabButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'

import { Dialog } from '@/admin/shared/services/dialog'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { AdminPageState } from '../admin-page-state'

import { CreateAdminDialog } from './components/create-admin-dialog'
import { AdminCreateDTO } from './interfaces/admin-create-dto'
import { AdminCreate } from './services/admin-create'

@Component({
  selector: 'ja-admin-create-feat',
  imports: [MatFabButton, MatIcon],
  templateUrl: './create-feat.html',
})
export class CreateFeat {
  private readonly _dialog = inject(Dialog)
  private readonly _adminCreate = inject(AdminCreate)
  private readonly _state = inject(AdminPageState)
  private readonly _snackbar = inject(Snackbar)

  handleClick(): void {
    this._dialog.open(CreateAdminDialog, {
      data: { handleSubmit: this._handleSubmit },
      size: 'medium',
    })
  }

  private _handleSubmit = async (formData: AdminCreateDTO): Promise<void> => {
    try {
      const admin = await this._adminCreate.create(formData)

      this._state.emitAdminCreated(admin)
      this._snackbar.success('Admin created successfully')
    } catch {
      this._snackbar.error('Failed to create admin')
    }
  }
}
