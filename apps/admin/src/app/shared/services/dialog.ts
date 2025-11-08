import { ComponentType } from '@angular/cdk/overlay'
import { Injectable, inject } from '@angular/core'
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog'

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  private readonly _dialog = inject(MatDialog)
  private readonly _dialogRef = inject(MatDialogRef)

  private readonly _sizeConfig: MatDialogConfig = {
    minWidth: '320px',
    maxWidth: '90vw',
    width: 'fit-content',
  }

  open<R = unknown, T = unknown, D = unknown>(
    component: ComponentType<T>,
    data?: D,
    options?: Omit<MatDialogConfig, 'data'>,
  ): MatDialogRef<T, R> {
    const config: MatDialogConfig<D> = {
      ...this._sizeConfig,
      ...options,
      data,
    }

    return this._dialog.open(component, config)
  }

  close<D>(data?: D): void {
    this._dialogRef.close(data)
  }
}
