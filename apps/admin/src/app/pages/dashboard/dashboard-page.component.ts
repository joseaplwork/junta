import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { HasPermissionDirective } from '@/admin/directives/has-permission.directive'
import { ButtonComponent } from '@/admin/shared/components/button/button.component'
import { AdminProfileService } from '@/admin/shared/services/admin-profile.service'

import { LogoutService } from './services/logout.service'

@Component({
  imports: [
    CommonModule,
    ButtonComponent,
    HasPermissionDirective,
    RouterModule,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  private readonly _logout = inject(LogoutService)
  readonly profile = inject(AdminProfileService)

  logout() {
    this._logout.endSession()
  }
}
