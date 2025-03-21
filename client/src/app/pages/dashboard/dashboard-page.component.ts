import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'

import { HasPermissionDirective } from '@/client/directives'
import { ButtonComponent } from '@/client/shared/components'
import { AdminProfileService } from '@/client/shared/services'

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
