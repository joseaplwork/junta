import { Routes } from '@angular/router'

import { RouteAuthProtection } from './guards/route-auth-protection'
import { RouteSessionRedirection } from './guards/route-session-redirection'
import { MainLayout } from './layouts/main-layout/main-layout'
import { AdminPage } from './pages/admin/admin-page'
import { DashboardPage } from './pages/dashboard/dashboard-page'
import { JuntaCreatePage } from './pages/junta-create/junta-create-page'
import { JuntaDetailsPage } from './pages/junta-details/junta-details-page'
import { JuntaPage } from './pages/junta/junta-page'
import { LoginPage } from './pages/login/login-page'
import { ParticipantDetailsPage } from './pages/participant-details/participant-details-page'
import { ParticipantPage } from './pages/participant/participant-page'

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
        path: 'participant',
        component: ParticipantPage,
      },
      {
        path: 'participant/:id',
        component: ParticipantDetailsPage,
      },
      {
        path: 'junta',
        component: JuntaPage,
      },
      {
        path: 'junta/create',
        component: JuntaCreatePage,
      },
      {
        path: 'junta/edit/:id',
        component: JuntaCreatePage,
      },
      {
        path: 'junta/:id',
        component: JuntaDetailsPage,
      },
    ],
  },
]
