import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { HasPermission } from '@/admin/directives/has-permission'
import { Button } from '@/admin/shared/components/button'
import { AdminProfileService } from '@/admin/shared/services/admin-profile.service'

import { LogoutService } from './services/logout.service'

@Component({
  imports: [CommonModule, Button, HasPermission, RouterModule],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  private readonly _logout = inject(LogoutService)
  readonly profile = inject(AdminProfileService)

  logout() {
    this._logout.endSession()
  }
}
