import { Component, OnInit, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SessionExpiredDialog } from '@/admin/shared/components/dialog/session-expired-dialog'
import { AdminProfile } from '@/admin/shared/services/admin-profile'
import { AppState } from '@/admin/shared/services/app-state'

import { Sidebar } from './components/sidebar/sidebar'

@Component({
  imports: [RouterOutlet, SessionExpiredDialog, Sidebar],
  template: `
    <ja-sidebar>
      <router-outlet></router-outlet>
    </ja-sidebar>
    <ja-session-expired-dialog></ja-session-expired-dialog>
  `,
})
export class RootLayout implements OnInit {
  private readonly _appState = inject(AppState)
  private readonly _profile = inject(AdminProfile)

  ngOnInit(): void {
    this._profile.set()
    this._appState.startSession()
  }
}
