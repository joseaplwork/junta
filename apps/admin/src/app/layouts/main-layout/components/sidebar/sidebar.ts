import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'

import { Permission } from '@junta/shared/enums/permission'

import { HasPermission } from '@/admin/directives/has-permission'
import { AdminProfile } from '@/admin/shared/services/admin-profile'
import { Logout } from '@/admin/shared/services/logout'

import { MenuItem } from '../../interfaces/menu-item'

@Component({
  selector: 'ja-sidebar',
  imports: [
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

  readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      exact: true,
    },
    {
      label: 'Admins',
      icon: 'admin_panel_settings',
      route: '/dashboard/admin',
      permission: Permission.ADMIN_READ,
    },
    {
      label: 'Users',
      icon: 'person',
      route: '/dashboard/user',
      permission: Permission.USER_READ,
    },
    {
      label: 'Juntas',
      icon: 'savings',
      route: '/dashboard/junta',
      permission: Permission.JUNTA_READ,
    },
  ]

  logout(): void {
    this._logout.endSession()
  }
}
