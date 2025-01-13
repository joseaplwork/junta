import { Routes } from '@angular/router';

import { AuthGuard, AuthRedirectGuard } from './guards';
import { AdminDashboardLayoutComponent } from './layout';
import {
  CreateAdminPageComponent,
  CreateUserPageComponent,
  DashboardPageComponent,
  LoginPageComponent,
} from './pages';

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
];
