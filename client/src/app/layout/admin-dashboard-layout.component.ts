import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SessionExpiredDialogComponent } from '@client/shared/components';
import { AdminProfileService, AppStateService } from '@client/shared/services';

@Component({
  imports: [RouterOutlet, SessionExpiredDialogComponent],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
    <ja-session-expired-dialog></ja-session-expired-dialog>
  `,
})
export class AdminDashboardLayoutComponent implements OnInit {
  constructor(
    private _app: AppStateService,
    private _profile: AdminProfileService,
  ) {}

  ngOnInit(): void {
    this._profile.set();
    this._app.startSession();
  }
}
