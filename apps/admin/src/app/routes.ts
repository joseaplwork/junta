import { Routes } from '@angular/router'

import { RouteAuthProtection } from './guards/route-auth-protection'
import { RouteSessionRedirection } from './guards/route-session-redirection'
import { RootLayout } from './pages/[root]/layout'
import { AdminListPage } from './pages/admin-list/admin-list-page'
import { CreateAdminPage } from './pages/create-admin/create-admin-page'
import { CreateUserPage } from './pages/create-user/create-user-page'
import { DashboardPage } from './pages/dashboard/dashboard-page'
import { LoginPage } from './pages/login/login-page'
import { UserListPage } from './pages/user-list/user-list-page'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [RouteSessionRedirection],
    component: LoginPage,
  },
  {
    path: 'dashboard',
    component: RootLayout,
    canActivate: [RouteAuthProtection],
    children: [
      { path: '', component: DashboardPage },
      {
        path: 'admin',
        component: AdminListPage,
      },
      {
        path: 'create-admin',
        component: CreateAdminPage,
      },
      {
        path: 'users',
        component: UserListPage,
      },
      {
        path: 'create-user',
        component: CreateUserPage,
      },
    ],
  },
]
