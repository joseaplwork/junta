import { Routes } from '@angular/router';

import { AuthGuard, AuthRedirectGuard } from './guards';
import {
  CreateAdminPageComponent,
  DashboardPageComponent,
  LoginPageComponent,
} from './pages';
import { AdminSessionLayoutComponent } from './shared/components';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [AuthRedirectGuard],
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: AdminSessionLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      {
        path: 'create-admin',
        component: CreateAdminPageComponent,
      },
    ],
  },
];
