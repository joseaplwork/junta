import { Routes } from '@angular/router'

import { Permission } from '@junta/contracts'

import { authGuard } from './guards/auth-guard'
import { guestGuard } from './guards/guest-guard'
import { permissionGuard } from './guards/permission-guard'

/**
 * Every page and the layout are lazy-loaded. Route params (`:id`) bind to
 * inputs of the page component through `withComponentInputBinding()`.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login-page').then(m => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard-page').then(m => m.DashboardPage),
      },
      {
        path: 'admin',
        canActivate: [permissionGuard(Permission.ADMIN_READ)],
        loadComponent: () =>
          import('./pages/admin/admin-page').then(m => m.AdminPage),
      },
      {
        path: 'participant',
        canActivate: [permissionGuard(Permission.PARTICIPANT_READ)],
        loadComponent: () =>
          import('./pages/participant/participant-page').then(
            m => m.ParticipantPage,
          ),
      },
      {
        path: 'participant/:id',
        canActivate: [permissionGuard(Permission.PARTICIPANT_READ)],
        loadComponent: () =>
          import('./pages/participant-details/participant-details-page').then(
            m => m.ParticipantDetailsPage,
          ),
      },
      {
        path: 'junta',
        canActivate: [permissionGuard(Permission.JUNTA_READ)],
        loadComponent: () =>
          import('./pages/junta/junta-page').then(m => m.JuntaPage),
      },
      {
        path: 'junta/create',
        canActivate: [permissionGuard(Permission.JUNTA_CREATE)],
        loadComponent: () =>
          import('./pages/junta-create/junta-create-page').then(
            m => m.JuntaCreatePage,
          ),
      },
      {
        path: 'junta/edit/:id',
        canActivate: [permissionGuard(Permission.JUNTA_UPDATE)],
        loadComponent: () =>
          import('./pages/junta-create/junta-create-page').then(
            m => m.JuntaCreatePage,
          ),
      },
      {
        path: 'junta/:id',
        canActivate: [permissionGuard(Permission.JUNTA_READ)],
        loadComponent: () =>
          import('./pages/junta-details/junta-details-page').then(
            m => m.JuntaDetailsPage,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
]
