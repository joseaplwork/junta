import { Component, signal } from '@angular/core';

import { MessagingSystemService } from '@client/shared/services/messaging-system.service';

@Component({
  selector: 'app-session-expired-dialog',
  template: `<app-dialog
    [open]="show"
    title="Session expired"
    content="Do you want to continue with the session?"
    primaryText="continue"
    secondaryText="cancel"
    (primaryClick)="handlePrimaryClick()"
    (secondaryClick)="handleSecondaryClick()">
  </app-dialog>`,
})
export class SessionExpiredDialogComponent {
  show = signal(false);

  constructor(private _messagingSystem: MessagingSystemService) {
    this.show = this._messagingSystem.sessionConfirmationAlert;
  }

  handlePrimaryClick() {}

  handleSecondaryClick() {}
}
