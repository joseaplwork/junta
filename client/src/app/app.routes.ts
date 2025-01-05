import { Routes } from '@angular/router';

import { AuthGuard, AuthRedirectGuard } from './guards';
import {
  CreateAdminPageComponent,
  CreateUserPageComponent,
  DashboardPageComponent,
  LoginPageComponent,
} from './pages';
import { AdminSessionLayoutComponent } from './pages/layout';

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
      {
        path: 'create-user',
        component: CreateUserPageComponent,
      },
    ],
  },
];
