import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'

import { HasPermission } from '@/admin/directives/has-permission'
import { AdminProfile } from '@/admin/shared/services/admin-profile'
import { Logout } from '@/admin/shared/services/logout'

@Component({
  selector: 'ja-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    HasPermission,
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly _logout = inject(Logout)
  readonly profile = inject(AdminProfile)

  logout(): void {
    this._logout.endSession()
  }
}
