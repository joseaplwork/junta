import { Route } from '@angular/router';

import { AuthGuard, LoggedOutGuard } from './guards';
import {
  DashboardPageComponent,
  LoginPageComponent,
  RegisterPageComponent
} from './pages';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoggedOutGuard],
    component: LoginPageComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      {
        path: 'register',
        component: RegisterPageComponent
      }
    ]
  }
];
