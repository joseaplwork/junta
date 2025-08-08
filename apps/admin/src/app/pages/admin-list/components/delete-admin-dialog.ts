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
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <div mat-dialog-content>
      <p>
        Are you sure you want to delete the admin {{ data.user.name }}
        {{ data.user.surname }}?
      </p>
      <p class="mt-2 text-red-500">This action cannot be undone.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Delete
      </button>
    </div>
  `,
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
