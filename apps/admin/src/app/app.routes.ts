import { Routes } from '@angular/router'

import { RouteAuthProtection } from './guards/route-auth-protection'
import { RouteSessionRedirection } from './guards/route-session-redirection'
import { AdminDashboardLayout } from './layout/admin-dashboard-layout'
import { CreateAdminPage } from './pages/create-admin/create-admin-page'
import { CreateUserPage } from './pages/create-user/create-user-page'
import { DashboardPage } from './pages/dashboard/dashboard-page'
import { LoginPageComponent } from './pages/login/login-page'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [RouteSessionRedirection],
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardLayout,
    canActivate: [RouteAuthProtection],
    children: [
      { path: '', component: DashboardPage },
      {
        path: 'create-admin',
        component: CreateAdminPage,
      },
      {
        path: 'create-user',
        component: CreateUserPage,
      },
    ],
  },
]
