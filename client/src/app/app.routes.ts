import { Route } from '@angular/router';

import { SessionLayoutComponent } from '@client/shared/components/layout/session-layout.component';

import { AuthGuard, AuthRedirectGuard } from './guards';
import {
  DashboardPageComponent,
  LoginPageComponent,
  RegisterPageComponent,
} from './pages';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [AuthRedirectGuard],
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: SessionLayoutComponent,
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
