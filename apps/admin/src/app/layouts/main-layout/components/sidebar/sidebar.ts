import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'

import { Permission } from '@junta/contracts'

import { HasPermission } from '@/admin/directives/has-permission'
import { AdminProfile } from '@/admin/shared/services/admin-profile'
import { AdminSession } from '@/admin/shared/services/admin-session'

import { MenuItem } from '../../interfaces/menu-item'

@Component({
  selector: 'ja-sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    HasPermission,
  ],
})
export class Sidebar {
  private readonly _session = inject(AdminSession)

  readonly profile = inject(AdminProfile)
  readonly collapsed = signal(true)

  readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      exact: true,
    },
    {
      label: 'Accounts',
      icon: 'admin_panel_settings',
      route: '/dashboard/account',
      permission: Permission.ACCOUNT_READ,
    },
    {
      label: 'Participants',
      icon: 'person',
      route: '/dashboard/participant',
      permission: Permission.PARTICIPANT_READ,
    },
    {
      label: 'Juntas',
      icon: 'savings',
      route: '/dashboard/junta',
      permission: Permission.JUNTA_READ,
    },
  ]

  toggle(): void {
    this.collapsed.update(collapsed => !collapsed)
  }

  logout(): void {
    void this._session.logout()
  }
}
