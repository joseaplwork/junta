import { Component, inject } from '@angular/core'
import { MatFabButton } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'

import { SnackbarService } from '@/admin/shared/services/snackbar.service'

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
  private readonly _dialog = inject(MatDialog)
  private readonly _adminCreate = inject(AdminCreate)
  private readonly _state = inject(AdminPageState)
  private readonly _snackbar = inject(SnackbarService)

  handleClick(): void {
    this._dialog.open(CreateAdminDialog, {
      width: '500px',
      data: { handleSubmit: this._handleSubmit },
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
