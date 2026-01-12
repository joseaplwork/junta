import { Routes } from '@angular/router'

import { RouteAuthProtection } from './guards/route-auth-protection'
import { RouteSessionRedirection } from './guards/route-session-redirection'
import { MainLayout } from './layouts/main-layout/main-layout'
import { AdminPage } from './pages/admin/admin-page'
import { DashboardPage } from './pages/dashboard/dashboard-page'
import { JuntaDetailsPage } from './pages/junta-details/junta-details-page'
import { JuntaPage } from './pages/junta/junta-page'
import { LoginPage } from './pages/login/login-page'
import { UserDetailsPage } from './pages/user-details/user-details-page'
import { UserPage } from './pages/user/user-page'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [RouteSessionRedirection],
    component: LoginPage,
  },
  {
    path: 'dashboard',
    component: MainLayout,
    canActivate: [RouteAuthProtection],
    children: [
      { path: '', component: DashboardPage },
      {
        path: 'admin',
        component: AdminPage,
      },
      {
        path: 'user',
        component: UserPage,
      },
      {
        path: 'user/:id',
        component: UserDetailsPage,
      },
      {
        path: 'junta',
        component: JuntaPage,
      },
      {
        path: 'junta/:id',
        component: JuntaDetailsPage,
      },
    ],
  },
]
