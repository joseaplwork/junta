import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.html',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class DeleteUserDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteUserDialog>)
  readonly data = inject<{ name: string }>(MAT_DIALOG_DATA)

  confirmDelete() {
    this.dialogRef.close(true)
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
