import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { ButtonComponent } from '@/client/components/button/button.component'
import { HasPermissionDirective } from '@/client/directives/has-permission.directive'
import { AdminProfileService } from '@/client/services/admin-profile.service'

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
