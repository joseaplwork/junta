import { Routes } from '@angular/router'

import { AuthRedirectGuard } from './guards/auth-redirect.guard'
import { AuthGuard } from './guards/auth.guard'
import { AdminDashboardLayoutComponent } from './layout/admin-dashboard-layout.component'
import { CreateAdminPageComponent } from './pages/create-admin/create-admin-page.component'
import { CreateUserPageComponent } from './pages/create-user/create-user-page.component'
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component'
import { LoginPageComponent } from './pages/login/login-page.component'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [AuthRedirectGuard],
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      {
        path: 'create-admin',
        component: CreateAdminPageComponent,
      },
      {
        path: 'create-user',
        component: CreateUserPageComponent,
      },
    ],
  },
]
