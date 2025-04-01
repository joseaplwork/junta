import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { HasPermission } from '@/admin/directives/has-permission'
import { Button } from '@/admin/shared/components/button'
import { AdminProfile } from '@/admin/shared/services/admin-profile'

import { Logout } from './services/logout'

@Component({
  imports: [CommonModule, Button, HasPermission, RouterModule],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  private readonly _logout = inject(Logout)
  readonly profile = inject(AdminProfile)

  logout() {
    this._logout.endSession()
  }
}
