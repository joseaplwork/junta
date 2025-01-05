import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SessionExpiredDialogComponent } from '@client/shared/components';
import { AppStateService } from '@client/shared/services';
import { AdminProfileService } from '@client/shared/services/admin-profile.service';

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
  constructor(
    private _app: AppStateService,
    private _profile: AdminProfileService,
  ) {}

  ngOnInit(): void {
    this._profile.set();
    this._app.startSession();
  }
}
