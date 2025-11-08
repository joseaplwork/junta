import { Injectable, inject } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'

export interface SnackbarConfig {
  duration?: number
  action?: string
  panelClass?: string | string[]
}

@Injectable({
  providedIn: 'root',
})
export class Snackbar {
  private readonly _snackBar = inject(MatSnackBar)

  private readonly _defaultConfig: Required<SnackbarConfig> = {
    duration: 3000,
    action: 'Close',
    panelClass: [],
  }

  success(message: string, config?: SnackbarConfig): void {
    this.show(message, config)
  }

  error(message: string, config?: SnackbarConfig): void {
    this.show(message, config)
  }

  warning(message: string, config?: SnackbarConfig): void {
    this.show(message, config)
  }

  info(message: string, config?: SnackbarConfig): void {
    this.show(message, config)
  }

  show(message: string, config?: SnackbarConfig): void {
    const finalConfig: MatSnackBarConfig = {
      duration: config?.duration ?? this._defaultConfig.duration,
    }

    this._snackBar.open(
      message,
      config?.action ?? this._defaultConfig.action,
      finalConfig,
    )
  }
}
