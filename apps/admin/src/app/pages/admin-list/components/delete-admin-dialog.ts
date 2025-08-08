import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'

import { Admin } from '@/admin/shared/interfaces/admin'

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-admin-dialog.html',
})
export class DeleteAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<DeleteAdminDialog>)
  public data = inject(MAT_DIALOG_DATA) as Admin

  onConfirm(): void {
    this._dialogRef.close(true)
  }

  onCancel(): void {
    this._dialogRef.close(false)
  }
}
