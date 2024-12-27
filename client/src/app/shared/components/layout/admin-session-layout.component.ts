import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SessionExpiredDialogComponent } from '@client/shared/components';
import { AppStateService } from '@client/shared/services';

@Component({
  imports: [RouterOutlet, SessionExpiredDialogComponent],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
    <ja-session-expired-dialog></ja-session-expired-dialog>
  `,
})
export class AdminSessionLayoutComponent implements OnInit {
  constructor(private _app: AppStateService) {}

  ngOnInit(): void {
    this._app.startSession();
  }
}
