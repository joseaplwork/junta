import { Component, OnInit } from '@angular/core';

import { AppStateService, AuthService } from '@client/shared/services';

@Component({
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-session-expired-dialog></app-session-expired-dialog>
  `,
})
export class SessionLayoutComponent implements OnInit {
  constructor(
    private _app: AppStateService,
    private _auth: AuthService,
  ) {}

  ngOnInit(): void {
    this._app.startSession();
  }
}
