import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'

import { Admin } from '@/admin/shared/interfaces/admin'

@Component({
  selector: 'ja-delete-admin-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  template: `
    <h2 mat-dialog-title>Delete Admin</h2>

    <mat-dialog-content>
      <p>Are you sure you want to delete this admin?</p>
      <p class="font-semibold">{{ admin.email }}</p>
      <p class="text-sm text-gray-600">This action cannot be undone.</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button type="button" mat-button (click)="onCancel()">Cancel</button>
      <button
        type="button"
        mat-raised-button
        color="warn"
        (click)="onConfirm()">
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class DeleteAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<DeleteAdminDialog>)
  readonly admin = inject<Admin>(MAT_DIALOG_DATA)

  onConfirm(): void {
    this._dialogRef.close(true)
  }

  onCancel(): void {
    this._dialogRef.close(false)
  }
}
