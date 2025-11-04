import { Component, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinner } from '@angular/material/progress-spinner'

import { Admin } from '@/admin/shared/interfaces/admin'

@Component({
  selector: 'ja-delete-admin-dialog',

  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatProgressSpinner,
  ],
  templateUrl: './delete-admin-dialog.html',
})
export class DeleteAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<DeleteAdminDialog>)

  readonly deleting = signal(false)
  readonly data = inject<{
    admin: Admin
    handleDelete: (admin: Admin) => Promise<void>
  }>(MAT_DIALOG_DATA)

  async onConfirm(): Promise<void> {
    this.deleting.set(true)
    await this.data.handleDelete(this.data.admin)
    this._dialogRef.close(true)
  }

  onCancel(): void {
    this._dialogRef.close(false)
  }
}
