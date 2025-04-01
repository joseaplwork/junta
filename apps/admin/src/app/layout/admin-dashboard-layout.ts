import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SessionExpiredDialog } from '@/admin/shared/components/dialog/session-expired-dialog'
import { AdminProfile } from '@/admin/shared/services/admin-profile'
import { AppState } from '@/admin/shared/services/app-state'

@Component({
  imports: [RouterOutlet, SessionExpiredDialog],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
    <ja-session-expired-dialog></ja-session-expired-dialog>
  `,
})
export class AdminDashboardLayout implements OnInit {
  private readonly _app = inject(AppState)
  private readonly _profile = inject(AdminProfile)

  ngOnInit(): void {
    this._profile.set()
    this._app.startSession()
  }
}
