import { Routes } from '@angular/router';

import { AdminSessionLayoutComponent } from '@client/shared/components/layout/admin-session-layout.component';

import { AuthGuard, AuthRedirectGuard } from './guards';
import {
  DashboardPageComponent,
  LoginPageComponent,
  RegisterPageComponent,
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
    component: AdminSessionLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
    ],
  },
];
