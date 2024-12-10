import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagingSystemService {
  private _sessionConfirmationAlert = signal(false);

  get sessionConfirmationAlert() {
    return this._sessionConfirmationAlert;
  }

  displaySessionExpirationAlert() {
    this._sessionConfirmationAlert.set(true);
  }

  hideSessionExpirationAlert() {
    this._sessionConfirmationAlert.set(false);
  }
}
