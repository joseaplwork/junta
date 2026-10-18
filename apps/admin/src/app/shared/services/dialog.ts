import { ComponentType } from '@angular/cdk/overlay'
import { Injectable, inject } from '@angular/core'
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog'

/** Opens Material dialogs with the app-wide size defaults. */
@Injectable({ providedIn: 'root' })
export class Dialog {
  private readonly _dialog = inject(MatDialog)

  private readonly _sizeConfig: MatDialogConfig = {
    minWidth: '320px',
    maxWidth: '90vw',
    width: 'fit-content',
  }

  open<Component, Data, Result = unknown>(
    component: ComponentType<Component>,
    data: Data,
    options?: Omit<MatDialogConfig<Data>, 'data'>,
  ): MatDialogRef<Component, Result> {
    return this._dialog.open<Component, Data, Result>(component, {
      ...this._sizeConfig,
      ...options,
      data,
    })
  }
}
