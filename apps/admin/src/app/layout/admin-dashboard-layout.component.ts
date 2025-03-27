import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SessionExpiredDialogComponent } from '@/admin/shared/components/dialog/session-expired-dialog.component'
import { AdminProfileService } from '@/admin/shared/services/admin-profile.service'
import { AppStateService } from '@/admin/shared/services/app-state.service'

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
