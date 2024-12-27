import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppStateService } from '@client/shared/services';

import { SessionExpiredDialogComponent } from '../dialog/session-expired-dialog.component';

@Component({
  imports: [RouterOutlet, SessionExpiredDialogComponent],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-session-expired-dialog></app-session-expired-dialog>
  `,
})
export class AdminSessionLayoutComponent implements OnInit {
  constructor(private _app: AppStateService) {}

  ngOnInit(): void {
    this._app.startSession();
  }
}
