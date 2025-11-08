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
export class SnackbarService {
  private readonly _snackBar = inject(MatSnackBar)

  private readonly _defaultConfig: Required<SnackbarConfig> = {
    duration: 3000,
    action: 'Close',
    panelClass: [],
  }

  success(message: string, config?: SnackbarConfig): void {
    this.show(message, {
      ...config,
      panelClass: ['success-snackbar', ...(config?.panelClass || [])],
    })
  }

  error(message: string, config?: SnackbarConfig): void {
    this.show(message, {
      ...config,
      panelClass: ['error-snackbar', ...(config?.panelClass || [])],
    })
  }

  warning(message: string, config?: SnackbarConfig): void {
    this.show(message, {
      ...config,
      panelClass: ['warning-snackbar', ...(config?.panelClass || [])],
    })
  }

  info(message: string, config?: SnackbarConfig): void {
    this.show(message, {
      ...config,
      panelClass: ['info-snackbar', ...(config?.panelClass || [])],
    })
  }

  show(message: string, config?: SnackbarConfig): void {
    const finalConfig: MatSnackBarConfig = {
      duration: config?.duration ?? this._defaultConfig.duration,
      panelClass: config?.panelClass ?? this._defaultConfig.panelClass,
    }

    this._snackBar.open(
      message,
      config?.action ?? this._defaultConfig.action,
      finalConfig,
    )
  }
}
