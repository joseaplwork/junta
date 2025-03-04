import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SessionExpiredDialogComponent } from '@/client/components/dialog/session-expired-dialog.component'
import { AdminProfileService } from '@/client/services/admin-profile.service'
import { AppStateService } from '@/client/services/app-state.service'

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
  private readonly _app = inject(AppStateService)
  private readonly _profile = inject(AdminProfileService)

  ngOnInit(): void {
    this._profile.set()
    this._app.startSession()
  }
}
