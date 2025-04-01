import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class AppState {
  private _hasSession = signal(false)

  get hasSession() {
    return this._hasSession.asReadonly()
  }

  endSession() {
    this._hasSession.set(false)
  }

  startSession() {
    this._hasSession.set(true)
  }
}
