import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'

import { User } from '@/admin/shared/interfaces/user'

interface DeleteUserDialogData {
  user: User
  handleDelete: (user: User) => Promise<void>
}

@Component({
  selector: 'ja-delete-user-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './delete-user-dialog.html',
})
export class DeleteUserDialog {
  private readonly _dialogRef = inject(MatDialogRef<DeleteUserDialog>)
  public readonly data = inject<DeleteUserDialogData>(MAT_DIALOG_DATA)

  async handleDelete(): Promise<void> {
    try {
      await this.data.handleDelete(this.data.user)
      this._dialogRef.close()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  handleCancel(): void {
    this._dialogRef.close()
  }
}
