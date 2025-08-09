import { Component, inject } from '@angular/core'
import { MatFabButton } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatIcon } from '@angular/material/icon'

import { AdminPageState } from '../admin-page-state'

import { CreateAdminDialog } from './components/create-admin-dialog'

@Component({
  selector: 'app-admin-create-feature',
  standalone: true,
  imports: [MatFabButton, MatIcon],
  template: `
    <button
      mat-fab
      color="primary"
      (click)="openCreateDialog()"
      class="fixed bottom-6 right-6 z-10"
      aria-label="Create admin">
      <mat-icon>add</mat-icon>
    </button>
  `,
})
export class CreateFeature {
  private readonly _dialog = inject(MatDialog)
  private readonly _AdminPageState = inject(AdminPageState)

  openCreateDialog(): void {
    const dialogRef = this._dialog.open(CreateAdminDialog, {
      width: '400px',
    })

    dialogRef.afterClosed().subscribe(admin => {
      if (admin) {
        this._AdminPageState.addNewAdmin(admin)
      }
    })
  }
}
